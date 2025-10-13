import { Contract } from "ethers";
import { toast } from "sonner";

export const handleContractError = (error: any, customMessage?: string) => {
  console.error("Contract error:", error);
  
  if (error.reason) {
    toast.error(error.reason);
  } else if (error.message) {
    if (error.message.includes("user rejected")) {
      toast.error("Transaction rejected");
    } else {
      toast.error(customMessage || "Transaction failed");
    }
  } else {
    toast.error(customMessage || "An error occurred");
  }
};

export const waitForTransaction = async (tx: any, successMessage?: string) => {
  try {
    toast.loading("Transaction pending...");
    const receipt = await tx.wait();
    toast.dismiss();
    if (successMessage) {
      toast.success(successMessage);
    }
    return receipt;
  } catch (error) {
    toast.dismiss();
    handleContractError(error);
    throw error;
  }
};

export interface Bank {
  id: number;
  bName: string;
  addr: string;
  isApproved: boolean;
}

export interface Customer {
  kycId: string;
  name: string;
  pan: string;
  kycStatus: number;
  email?: string;
  phone?: string;
}

export interface KYCRecord {
  kycId: string;
  recordType: string;
  ipfsHash: string;
  timestamp: number;
}

export interface KYCHistory {
  kycId: string;
  bankName: string;
  remarks: string;
  verdict: number;
  timestamp: number;
}

export async function getAllBanks(contract: Contract): Promise<Bank[]> {
  try {
    const bankCount = await contract.getAllBanksCount();
    const banks: Bank[] = [];
    
    for (let i = 0; i < bankCount; i++) {
      const bankAddr = await contract.BankList(i);
      const bankData = await contract.Banks(bankAddr);
      banks.push({
        id: Number(bankData.id),
        bName: bankData.bName,
        addr: bankData.addr,
        isApproved: bankData.isApproved
      });
    }
    
    return banks;
  } catch (error) {
    console.error("Error fetching banks:", error);
    return [];
  }
}

export async function getAllCustomers(contract: Contract): Promise<Customer[]> {
  try {
    const customerCount = await contract.getAllCustomersCount();
    const customers: Customer[] = [];
    
    for (let i = 0; i < customerCount; i++) {
      const kycId = await contract.CustomerList(i);
      const customerData = await contract.Customers(kycId);
      customers.push({
        kycId: customerData.kycId,
        name: customerData.name,
        pan: customerData.pan,
        kycStatus: Number(customerData.kycStatus)
      });
    }
    
    return customers;
  } catch (error) {
    console.error("Error fetching customers:", error);
    return [];
  }
}

export async function getCustomerRecords(contract: Contract, kycId: string): Promise<KYCRecord[]> {
  try {
    const recordCount = await contract.getCustomerRecordsCount(kycId);
    const records: KYCRecord[] = [];
    
    for (let i = 0; i < recordCount; i++) {
      const record = await contract.getCustomerRecord(kycId, i);
      records.push({
        kycId,
        recordType: record.bName,
        ipfsHash: record.data,
        timestamp: Number(record.time)
      });
    }
    
    return records;
  } catch (error) {
    console.error("Error fetching customer records:", error);
    return [];
  }
}

export async function getKycHistory(contract: Contract, kycId: string): Promise<KYCHistory[]> {
  try {
    const historyCount = await contract.getKycHistoryCount(kycId);
    const history: KYCHistory[] = [];
    
    for (let i = 0; i < historyCount; i++) {
      const entry = await contract.getKycHistoryEntry(kycId, i);
      history.push({
        kycId,
        bankName: entry.bName,
        remarks: entry.remarks,
        verdict: Number(entry.status),
        timestamp: Number(entry.time)
      });
    }
    
    return history;
  } catch (error) {
    console.error("Error fetching KYC history:", error);
    return [];
  }
}

export async function getBankRequests(contract: Contract, bankAddress: string): Promise<string[]> {
  try {
    const bankData = await contract.Banks(bankAddress);
    return bankData.requestList || [];
  } catch (error) {
    console.error("Error fetching bank requests:", error);
    return [];
  }
}

export async function getBankApprovals(contract: Contract, bankAddress: string): Promise<string[]> {
  try {
    const bankData = await contract.Banks(bankAddress);
    return bankData.approvals || [];
  } catch (error) {
    console.error("Error fetching bank approvals:", error);
    return [];
  }
}
