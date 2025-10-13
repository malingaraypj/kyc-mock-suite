// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract KYC {
    // Custom Errors
    error OnlyOwner();
    error OnlyAdmin();
    error OnlyAuthority();
    error OnlyBank();
    error InvalidAddress();
    error AlreadyAdmin();
    error NotAdmin();
    error CannotRemoveOwner();
    error AlreadyBank();
    error BankNotApproved();
    error NotAuthorized();
    error CustomerExists();
    error PanExists();
    error InvalidKycId();
    error InvalidPan();
    error CustomerNotFound();
    error BankNotFound();
    error RequestExists();
    error NoRequest();
    error AlreadyAuthorized();
    error NotAuthorizedToRemove();
    error InvalidVerdict();
    error NoRecords();
    error InvalidRecordType();
    error InvalidRecordData();

    // State variables
    address public owner;
    uint256 public bankIndex; // Changed from 'index' to 'bankIndex'

    // Mappings
    mapping(address => bool) public isAdmin;
    mapping(address => bool) public isBank;
    mapping(address => Bank) public Banks;
    mapping(string => Customer) public Customers;
    mapping(string => bool) public isCustomer;
    mapping(string => bool) public isCustomerFromPAN;
    mapping(address => mapping(string => bool)) public isRequested;
    mapping(address => mapping(string => uint256)) public bankRequestIndex;
    mapping(string => mapping(address => uint256)) public customerRequestIndex;
    mapping(string => mapping(address => bool)) public isBankAuth;

    // Arrays
    address[] public BankList;
    string[] public CustomerList;

    // Events
    event OwnerChanged(address indexed from, address indexed to);
    event AdminAdded(address indexed adminAddress);
    event AdminRemoved(address indexed adminAddress);
    event BankAdded(address indexed bankAddress, string name, uint256 id);
    event CustomerAdded(string indexed kycId, string name, string pan);
    event RequestAdded(address indexed bank, string indexed kycId);
    event RequestRemoved(address indexed bank, string indexed kycId);
    event RequestManaged(address indexed bank, string indexed kycId, bool approved);
    event KycStatusUpdated(string indexed kycId, uint256 status, string remarks);
    event AuthAdded(string indexed kycId, address indexed bank);
    event AuthRevoked(string indexed kycId, address indexed bank);
    event RecordUpdated(string indexed kycId, string recordType, string recordData);

    // Structs
    struct Bank {
        uint256 id;
        string bName;
        address addr;
        bool isApproved;
        string[] requestList;
        string[] approvals;
    }

    struct Customer {
        string kycId;
        string name;
        string pan;
        uint256 kycStatus; // 0: Not Initiated, 1: Accepted, 2: Rejected, 3: Revoked
        bytes32 vcHash;
        Records[] records;
        address[] requestList;
        address[] approvedBanks;
        KycVerdict[] kycHistory;
    }

    struct Records {
        string bName;
        string data;
        uint256 time;
    }

    struct KycVerdict {
        string bName;
        string remarks;
        uint256 status;
        uint256 time;
    }


    modifier onlyOwner() {
        if (msg.sender != owner) revert OnlyOwner();
        _;
    }

    modifier onlyAdmin() {
        if (!isAdmin[msg.sender]) revert OnlyAdmin();
        _;
    }

    modifier onlyAuthority() {
        if (!(isAdmin[msg.sender] || owner == msg.sender || isBank[msg.sender]))
            revert OnlyAuthority();
        _;
    }

    modifier onlyBank() {
        if (!isBank[msg.sender]) revert OnlyBank();
        _;
    }

    // Constructor
    constructor() {
        owner = msg.sender;
        isAdmin[msg.sender] = true;
    }

    // Owner Management
    function setOwner(address _owner) external onlyOwner returns (bool) {
        if (_owner == msg.sender) revert InvalidAddress();
        if (_owner == address(0)) revert InvalidAddress();
        emit OwnerChanged(owner, _owner);
        owner = _owner;
        isAdmin[_owner] = true;
        return true;
    }

    function addAdmin(address _address) external onlyOwner returns (bool) {
        if (_address == address(0)) revert InvalidAddress();
        if (isAdmin[_address]) revert AlreadyAdmin();
        isAdmin[_address] = true;
        emit AdminAdded(_address);
        return true;
    }

    function removeAdmin(address _address) external onlyOwner returns (bool) {
        if (_address == owner) revert CannotRemoveOwner();
        if (!isAdmin[_address]) revert NotAdmin();
        isAdmin[_address] = false;
        emit AdminRemoved(_address);
        return true;
    }

    // Bank Management
    function addBank(string memory _bName, address _addr) external onlyAdmin {
        if (isBank[_addr]) revert AlreadyBank();
        if (_addr == address(0)) revert InvalidAddress();
        if (bytes(_bName).length == 0) revert InvalidRecordData();

        BankList.push(_addr);
        bankIndex++; // Updated reference
        isBank[_addr] = true;
        Banks[_addr] = Bank({
            id: bankIndex, // Updated reference
            bName: _bName,
            addr: _addr,
            isApproved: true,
            requestList: new string[](0),
            approvals: new string[](0)
        });
        emit BankAdded(_addr, _bName, bankIndex); // Updated reference
    }

    function getBankByAddress(address _address)
        external
        view
        onlyAuthority
        returns (string memory bName, address addr, bool isApproved)
    {
        if (!Banks[_address].isApproved) revert BankNotApproved();
        if (!(isAdmin[msg.sender] || msg.sender == _address)) revert NotAuthorized();
        Bank memory bank = Banks[_address];
        return (bank.bName, bank.addr, bank.isApproved);
    }

    // Customer Management
    function addCustomer(
        string memory _name,
        string memory _pan,
        string memory _kycId,
        string memory _ipfsAadhar,
        string memory _ipfsPan,
        bytes32 _vcHash
    ) external onlyAdmin {
        if (isCustomer[_kycId]) revert CustomerExists();
        if (isCustomerFromPAN[_pan]) revert PanExists();
        if (bytes(_kycId).length == 0) revert InvalidKycId();
        if (bytes(_pan).length == 0) revert InvalidPan();

        Customer storage customer = Customers[_kycId];
        customer.kycId = _kycId;
        customer.name = _name;
        customer.pan = _pan;
        customer.kycStatus = 0;
        customer.vcHash = _vcHash;
        customer.records.push(Records("aadhar", _ipfsAadhar, block.timestamp));
        customer.records.push(Records("pan", _ipfsPan, block.timestamp));

        isCustomer[_kycId] = true;
        isCustomerFromPAN[_pan] = true;
        CustomerList.push(_kycId);
        emit CustomerAdded(_kycId, _name, _pan);
    }

    function updateRecord(string memory _kycId, string memory _recordType, string memory _recordData)
        external
        onlyAuthority
    {
        if (!isCustomer[_kycId]) revert CustomerNotFound();
        if (!(isAdmin[msg.sender] || isBankAuth[_kycId][msg.sender]))
            revert NotAuthorized();
        if (bytes(_recordType).length == 0) revert InvalidRecordType();
        if (bytes(_recordData).length == 0) revert InvalidRecordData();

        Customer storage customer = Customers[_kycId];
        bool found = false;
        for (uint256 i = 0; i < customer.records.length; i++) {
            if (
                keccak256(abi.encodePacked(customer.records[i].bName)) ==
                keccak256(abi.encodePacked(_recordType))
            ) {
                customer.records[i].data = _recordData;
                customer.records[i].time = block.timestamp;
                found = true;
                break;
            }
        }
        if (!found) {
            customer.records.push(Records(_recordType, _recordData, block.timestamp));
        }
        emit RecordUpdated(_kycId, _recordType, _recordData);
    }

    // Request Management
    function addRequest(string memory _kycId) external onlyBank {
        if (!isCustomer[_kycId]) revert CustomerNotFound();
        if (isRequested[msg.sender][_kycId] || isBankAuth[_kycId][msg.sender])
            revert RequestExists();

        Banks[msg.sender].requestList.push(_kycId);
        Customers[_kycId].requestList.push(msg.sender);
        isRequested[msg.sender][_kycId] = true;
        bankRequestIndex[msg.sender][_kycId] = Banks[msg.sender].requestList.length - 1;
        customerRequestIndex[_kycId][msg.sender] = Customers[_kycId].requestList.length - 1;
        emit RequestAdded(msg.sender, _kycId);
    }

    function removeRequest(string memory _kycId) external onlyBank {
        if (!isCustomer[_kycId]) revert CustomerNotFound();
        if (!isRequested[msg.sender][_kycId]) revert NoRequest();

        delete isRequested[msg.sender][_kycId];
        _removeElementFromBankRequestList(bankRequestIndex[msg.sender][_kycId], msg.sender);
        _removeElementFromCustomerRequestList(customerRequestIndex[_kycId][msg.sender], _kycId);
        emit RequestRemoved(msg.sender, _kycId);
    }

    function manageRequest(string memory _kycId, address _bankAddress, bool response)
        external
        onlyAdmin
    {
        if (!isCustomer[_kycId]) revert CustomerNotFound();
        if (!isBank[_bankAddress]) revert BankNotFound();
        if (!isRequested[_bankAddress][_kycId]) revert NoRequest();

        if (response) {
            isBankAuth[_kycId][_bankAddress] = true;
            Customers[_kycId].approvedBanks.push(_bankAddress);
            Banks[_bankAddress].approvals.push(_kycId);
            emit AuthAdded(_kycId, _bankAddress);
        }
        delete isRequested[_bankAddress][_kycId];
        _removeElementFromBankRequestList(bankRequestIndex[_bankAddress][_kycId], _bankAddress);
        _removeElementFromCustomerRequestList(customerRequestIndex[_kycId][_bankAddress], _kycId);
        emit RequestManaged(_bankAddress, _kycId, response);
    }

    // KYC Status Management
    function updateKycStatus(
        string memory _kycId,
        string memory _bName,
        string memory _remarks,
        uint256 _timeStamp,
        uint256 _verdict,
        bytes32 _vcHash
    ) external onlyBank {
        if (!isCustomer[_kycId]) revert CustomerNotFound();
        if (_verdict > 3) revert InvalidVerdict();
        if (!isBankAuth[_kycId][msg.sender]) revert NotAuthorized();

        Customer storage customer = Customers[_kycId];
        customer.kycHistory.push(KycVerdict(_bName, _remarks, _verdict, _timeStamp));
        customer.kycStatus = _verdict;
        if (_vcHash != bytes32(0)) {
            customer.vcHash = _vcHash;
        }
        _removeFromPendingList(_kycId);
        emit KycStatusUpdated(_kycId, _verdict, _remarks);
    }

    // Authorization Management
    function addAuth(string memory _kycId, address _bankAddress) external onlyAdmin {
        if (!isCustomer[_kycId]) revert CustomerNotFound();
        if (!isBank[_bankAddress]) revert BankNotFound();
        if (isBankAuth[_kycId][_bankAddress]) revert AlreadyAuthorized();
        if (msg.sender == _bankAddress) revert NotAuthorized();

        isBankAuth[_kycId][_bankAddress] = true;
        emit AuthAdded(_kycId, _bankAddress);
    }

    function revokeAuth(string memory _kycId, address _bankAddress) external onlyAdmin {
        if (!isCustomer[_kycId]) revert CustomerNotFound();
        if (!isBank[_bankAddress]) revert BankNotFound();
        if (!isBankAuth[_kycId][_bankAddress]) revert NotAuthorizedToRemove();
        if (msg.sender == _bankAddress) revert NotAuthorized();

        isBankAuth[_kycId][_bankAddress] = false;
        emit AuthRevoked(_kycId, _bankAddress);
    }

    // View Functions
    function getCustomerDetails(string memory _kycId)
        external
        view
        onlyAuthority
        returns (
            string memory kycId,
            string memory name,
            string memory pan,
            uint256 kycStatus,
            bytes32 vcHash
        )
    {
        if (!isCustomer[_kycId]) revert CustomerNotFound();
        if (!(isAdmin[msg.sender] || isBankAuth[_kycId][msg.sender]))
            revert NotAuthorized();
        Customer memory customer = Customers[_kycId];
        return (customer.kycId, customer.name, customer.pan, customer.kycStatus, customer.vcHash);
    }

    function getCustomerRecordsCount(string memory _kycId)
        external
        view
        onlyAuthority
        returns (uint256)
    {
        if (!isCustomer[_kycId]) revert CustomerNotFound();
        if (!(isAdmin[msg.sender] || isBankAuth[_kycId][msg.sender]))
            revert NotAuthorized();
        return Customers[_kycId].records.length;
    }

    function getCustomerRecord(string memory _kycId, uint256 index)
        external
        view
        onlyAuthority
        returns (string memory bName, string memory data, uint256 time)
    {
        if (!isCustomer[_kycId]) revert CustomerNotFound();
        if (!(isAdmin[msg.sender] || isBankAuth[_kycId][msg.sender]))
            revert NotAuthorized();
        if (index >= Customers[_kycId].records.length) revert NoRecords();
        Records memory record = Customers[_kycId].records[index];
        return (record.bName, record.data, record.time);
    }

    function getKycHistoryCount(string memory _kycId) external view onlyAuthority returns (uint256) {
        if (!isCustomer[_kycId]) revert CustomerNotFound();
        if (!(isAdmin[msg.sender] || isBankAuth[_kycId][msg.sender]))
            revert NotAuthorized();
        return Customers[_kycId].kycHistory.length;
    }

    function getKycHistoryEntry(string memory _kycId, uint256 index)
        external
        view
        onlyAuthority
        returns (string memory bName, string memory remarks, uint256 status, uint256 time)
    {
        if (!isCustomer[_kycId]) revert CustomerNotFound();
        if (!(isAdmin[msg.sender] || isBankAuth[_kycId][msg.sender]))
            revert NotAuthorized();
        if (index >= Customers[_kycId].kycHistory.length) revert NoRecords();
        KycVerdict memory verdict = Customers[_kycId].kycHistory[index];
        return (verdict.bName, verdict.remarks, verdict.status, verdict.time);
    }

    function getAllCustomersCount() external view onlyAdmin returns (uint256) {
        return CustomerList.length;
    }

    function getAllBanksCount() external view onlyAdmin returns (uint256) {
        return BankList.length;
    }

    function isCustomerRegistered(string memory _kycId) external view returns (bool) {
        return isCustomer[_kycId];
    }

    function isPanRegistered(string memory _pan) external view returns (bool) {
        return isCustomerFromPAN[_pan];
    }

    function isBankAuthorized(string memory _kycId, address _bankAddress)
        external
        view
        returns (bool)
    {
        return isBankAuth[_kycId][_bankAddress];
    }

    function getVerifiableCredentialHash(string memory _kycId)
        external
        view
        onlyAuthority
        returns (bytes32)
    {
        if (!isCustomer[_kycId]) revert CustomerNotFound();
        return Customers[_kycId].vcHash;
    }

    // Private Helper Functions
    function _removeElementFromBankRequestList(uint256 _index, address _bankAddress) private {
        string[] storage requests = Banks[_bankAddress].requestList;
        if (_index >= requests.length) return;
        string memory kycId = requests[_index];
        requests[_index] = requests[requests.length - 1];
        bankRequestIndex[_bankAddress][requests[_index]] = _index;
        requests.pop();
        delete bankRequestIndex[_bankAddress][kycId];
    }

    function _removeElementFromCustomerRequestList(uint256 _index, string memory _kycId) private {
        address[] storage requests = Customers[_kycId].requestList;
        if (_index >= requests.length) return;
        address bankAddr = requests[_index];
        requests[_index] = requests[requests.length - 1];
        customerRequestIndex[_kycId][requests[_index]] = _index;
        requests.pop();
        delete customerRequestIndex[_kycId][bankAddr];
    }

    function _removeFromPendingList(string memory _kycId) private {
        string[] storage approvals = Banks[msg.sender].approvals;
        for (uint256 i = 0; i < approvals.length; i++) {
            if (keccak256(abi.encodePacked(approvals[i])) == keccak256(abi.encodePacked(_kycId))) {
                approvals[i] = approvals[approvals.length - 1];
                approvals.pop();
                break;
            }
        }
    }
}
