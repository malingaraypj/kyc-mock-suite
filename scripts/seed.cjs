const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  
  // Get contract address
  const addressFile = path.join(__dirname, "..", "src", "contracts", "contract-address.json");
  const addressJson = JSON.parse(fs.readFileSync(addressFile, "utf8"));
  const contractAddress = addressJson.KYC;

  console.log("Seeding data to KYC contract on Sepolia at:", contractAddress);
  console.log("Using account:", deployer.address);
  console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString());

  // Attach to deployed contract
  const KYC = await hre.ethers.getContractFactory("KYC");
  const kyc = KYC.attach(contractAddress);

  console.log("\n✅ Contract ready for use!");
  console.log("The deployer account is the contract owner:", deployer.address);
  console.log("\n📝 Next steps:");
  console.log("1. Connect to the DApp with MetaMask");
  console.log("2. Use the Owner dashboard to add admins");
  console.log("3. Use the Admin dashboard to add banks and customers");
  console.log("\nView contract on Etherscan: https://sepolia.etherscan.io/address/" + contractAddress);
  
  // Save account info
  const accountsFile = path.join(__dirname, "..", "src", "contracts", "accounts.json");
  fs.writeFileSync(
    accountsFile,
    JSON.stringify({
      owner: deployer.address,
      admins: [],
      banks: [],
      customers: []
    }, null, 2)
  );

  console.log("\n✅ Account information saved to src/contracts/accounts.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
