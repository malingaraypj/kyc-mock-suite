# 🔐 KYC DApp - Decentralized Identity Verification

A blockchain-based KYC (Know Your Customer) system deployed on Ethereum Sepolia testnet.

## 🚀 Quick Start

### 1. Environment Setup

Create a `.env` file in the root directory:

```env
# Frontend Configuration
VITE_CONTRACT_ADDRESS=your_deployed_contract_address
VITE_NETWORK_ID=11155111

# Deployment Configuration
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY
PRIVATE_KEY=your_private_key_here
```

### 2. Get Sepolia ETH

Get free test ETH for Sepolia:
- [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)
- [Infura Sepolia Faucet](https://www.infura.io/faucet/sepolia)
- [QuickNode Faucet](https://faucet.quicknode.com/ethereum/sepolia)

### 3. Deploy to Sepolia

```bash
# Install dependencies
npm install

# Compile contracts
npx hardhat compile

# Deploy to Sepolia
npx hardhat run scripts/deploy.cjs --network sepolia

# Initialize contract (optional)
npx hardhat run scripts/seed.cjs --network sepolia
```

### 4. Configure MetaMask

1. Install [MetaMask](https://metamask.io/)
2. Add Sepolia Testnet:
   - **Network Name**: Sepolia
   - **RPC URL**: `https://sepolia.infura.io/v3/`
   - **Chain ID**: 11155111
   - **Currency Symbol**: ETH
   - **Block Explorer**: `https://sepolia.etherscan.io`

### 5. Run the Application

```bash
npm run dev
```

Open `http://localhost:5173` and connect your MetaMask wallet!

## ✨ Features

- **🔗 Blockchain Integration**: All data stored on Ethereum Sepolia testnet
- **👥 Role-Based Access**: Owner, Admin, Bank, and Customer roles
- **🎨 Modern UI**: Beautiful, responsive interface with Tailwind CSS
- **🔐 Secure**: MetaMask integration for secure transactions
- **📊 Real-time**: Live blockchain data updates

## 🎭 User Roles

### 👑 Owner
- Add/remove admins
- View system statistics
- Transfer ownership

### 🛡️ Admin
- Register and approve banks
- Add customers to the system
- Authorize bank access to customer data
- Manage KYC requests

### 🏦 Bank
- Request access to customer KYC data
- View authorized customer profiles
- Update KYC verification status

### 👤 Customer
- Register for KYC
- View personal KYC status
- View KYC history
- Request KYC validation

## 📜 Smart Contract

**Location**: `contracts/KYC.sol`

The contract handles:
- Customer registration and verification
- Bank authorization management
- KYC status updates (Pending, Accepted, Rejected, Revoked)
- Document record management with IPFS hashes
- Verifiable credentials integration

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Blockchain**: Ethereum (Sepolia), Hardhat, ethers.js v6
- **Smart Contracts**: Solidity 0.8.24
- **UI Components**: shadcn/ui
- **Notifications**: Sonner

## 🔧 Development

### Local Hardhat Network (Testing)

```bash
# Terminal 1: Start Hardhat node
npx hardhat node

# Terminal 2: Deploy locally
npx hardhat run scripts/deploy.cjs --network localhost

# Add test data
npx hardhat run scripts/seed.cjs --network localhost
```

Configure MetaMask for local testing:
- **Network**: Hardhat Localhost
- **RPC URL**: `http://127.0.0.1:8545`
- **Chain ID**: 31337

## 📝 License

MIT License
