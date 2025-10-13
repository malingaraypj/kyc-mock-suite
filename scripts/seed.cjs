const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  // Get contract address
  const addressFile = path.join(__dirname, "..", "src", "contracts", "contract-address.json");
  const addressJson = JSON.parse(fs.readFileSync(addressFile, "utf8"));
  const contractAddress = addressJson.KYC;

  // Get signers
  const [owner, admin1, admin2, bank1, bank2, bank3, customer1, customer2, customer3, customer4] = await hre.ethers.getSigners();

  // Attach to deployed contract
  const KYC = await hre.ethers.getContractFactory("KYC");
  const kyc = KYC.attach(contractAddress);

  console.log("Seeding data to KYC contract at:", contractAddress);
  console.log("Owner:", owner.address);

  // Add admins
  console.log("\nAdding admins...");
  await kyc.connect(owner).addAdmin(admin1.address);
  console.log("Admin 1 added:", admin1.address);
  await kyc.connect(owner).addAdmin(admin2.address);
  console.log("Admin 2 added:", admin2.address);

  // Add banks
  console.log("\nAdding banks...");
  await kyc.connect(admin1).addBank("Global Trust Bank", bank1.address);
  console.log("Bank 1 added:", bank1.address);
  await kyc.connect(admin1).addBank("Secure Finance Corp", bank2.address);
  console.log("Bank 2 added:", bank2.address);
  await kyc.connect(admin1).addBank("Digital Banking Ltd", bank3.address);
  console.log("Bank 3 added:", bank3.address);

  // Add customers
  console.log("\nAdding customers...");
  const vcHash = "0x" + "0".repeat(64); // Dummy hash

  await kyc.connect(admin1).addCustomer(
    "Alice Johnson",
    "ABCDE1234F",
    "KYC001",
    "QmX1abc...def123",
    "QmY2def...ghi456",
    vcHash
  );
  console.log("Customer 1 added: KYC001");

  await kyc.connect(admin1).addCustomer(
    "Bob Williams",
    "XYZAB5678C",
    "KYC002",
    "QmZ3ghi...jkl789",
    "QmA4jkl...mno012",
    vcHash
  );
  console.log("Customer 2 added: KYC002");

  await kyc.connect(admin1).addCustomer(
    "Carol Martinez",
    "PQRST9012D",
    "KYC003",
    "QmA4jkl...mno012",
    "QmB5mno...pqr345",
    vcHash
  );
  console.log("Customer 3 added: KYC003");

  await kyc.connect(admin1).addCustomer(
    "David Chen",
    "LMNOP3456E",
    "KYC004",
    "QmB5mno...pqr345",
    "QmC6pqr...stu678",
    vcHash
  );
  console.log("Customer 4 added: KYC004");

  // Add additional records for some customers
  console.log("\nAdding additional records...");
  await kyc.connect(admin1).updateRecord("KYC001", "Address Proof", "QmY2def...ghi456");
  await kyc.connect(admin1).updateRecord("KYC004", "Financial Statement", "QmC6pqr...stu678");

  // Create some requests
  console.log("\nCreating KYC requests...");
  await kyc.connect(bank3).addRequest("KYC003");
  console.log("Bank 3 requested access to KYC003");

  // Authorize some banks
  console.log("\nAuthorizing banks...");
  await kyc.connect(admin1).addAuth("KYC001", bank1.address);
  console.log("Bank 1 authorized for KYC001");
  await kyc.connect(admin1).addAuth("KYC002", bank2.address);
  console.log("Bank 2 authorized for KYC002");
  await kyc.connect(admin1).addAuth("KYC004", bank1.address);
  console.log("Bank 1 authorized for KYC004");

  // Update KYC status for some customers
  console.log("\nUpdating KYC statuses...");
  await kyc.connect(bank1).updateKycStatus(
    "KYC001",
    "Global Trust Bank",
    "All documents verified successfully",
    Math.floor(Date.now() / 1000),
    1, // Accepted
    vcHash
  );
  console.log("KYC001 status updated to Accepted");

  await kyc.connect(bank2).updateKycStatus(
    "KYC002",
    "Secure Finance Corp",
    "Incomplete documentation provided",
    Math.floor(Date.now() / 1000),
    2, // Rejected
    vcHash
  );
  console.log("KYC002 status updated to Rejected");

  await kyc.connect(bank1).updateKycStatus(
    "KYC004",
    "Global Trust Bank",
    "Customer profile verified and approved",
    Math.floor(Date.now() / 1000),
    1, // Accepted
    vcHash
  );
  console.log("KYC004 status updated to Accepted");

  // Save account addresses for frontend
  const accountsFile = path.join(__dirname, "..", "src", "contracts", "accounts.json");
  fs.writeFileSync(
    accountsFile,
    JSON.stringify({
      owner: owner.address,
      admins: [admin1.address, admin2.address],
      banks: [
        { address: bank1.address, name: "Global Trust Bank" },
        { address: bank2.address, name: "Secure Finance Corp" },
        { address: bank3.address, name: "Digital Banking Ltd" }
      ],
      customers: [
        { address: customer1.address, kycId: "KYC001" },
        { address: customer2.address, kycId: "KYC002" },
        { address: customer3.address, kycId: "KYC003" },
        { address: customer4.address, kycId: "KYC004" }
      ]
    }, null, 2)
  );

  console.log("\n✅ Seeding completed successfully!");
  console.log("Account addresses saved to src/contracts/accounts.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
