const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Deploying KYC contract...");

  const KYC = await hre.ethers.getContractFactory("KYC");
  const kyc = await KYC.deploy();

  await kyc.waitForDeployment();

  const address = await kyc.getAddress();
  console.log("KYC contract deployed to:", address);

  // Save contract address and ABI to frontend
  const contractsDir = path.join(__dirname, "..", "src", "contracts");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(contractsDir, "contract-address.json"),
    JSON.stringify({ KYC: address }, undefined, 2)
  );

  const KYCArtifact = await hre.artifacts.readArtifact("KYC");

  fs.writeFileSync(
    path.join(contractsDir, "KYC.json"),
    JSON.stringify(KYCArtifact, null, 2)
  );

  console.log("Contract address and ABI saved to src/contracts/");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
