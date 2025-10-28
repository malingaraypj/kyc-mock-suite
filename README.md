# 🔐 KYC Chain - Decentralized KYC Management System

A modern, blockchain-powered Know Your Customer (KYC) management platform built with React, TypeScript, Ethereum, and Hardhat. Features role-based access control, real-time blockchain interactions, and a beautiful UI.

## ✨ Features

- **🔗 Blockchain Integration**: All KYC data stored on Ethereum blockchain using Solidity smart contracts
- **👥 Role-Based Access**: Four distinct roles (Owner, Admin, Bank, Customer) with granular permissions
- **🎨 Modern UI**: Beautiful, responsive interface with animations and gradients
- **🔐 Web3 Wallet**: Seamless MetaMask integration for secure blockchain interactions
- **⚡ Local Development**: Full Hardhat testnet with pre-seeded dummy data
- **📊 Real-time Updates**: Instant blockchain transaction confirmations with toast notifications

## 🚀 Quick Start

### Prerequisites

- Node.js v18+ ([Download here](https://nodejs.org/))
- MetaMask browser extension ([Install here](https://metamask.io/))
- npm or yarn package manager

### Installation

1. **Clone and install:**

```bash
git clone <your-repo-url>
cd kyc-management-system
npm install
```

2. **Start Hardhat local blockchain:**

```bash
npx hardhat node
```

This starts a local Ethereum network at `http://127.0.0.1:8545` and displays 20 test accounts with private keys.

3. **Deploy the smart contract (in a new terminal):**

```bash
npx hardhat run scripts/deploy.cjs --network localhost
```

This deploys the KYC smart contract and saves the address/ABI to `src/contracts/`.

4. **Seed the blockchain with dummy data:**

```bash
npx hardhat run scripts/seed.cjs --network localhost
```

✅ **Dummy Data Created:**
- 2 Admins
- 3 Banks (Global Trust Bank, Secure Finance Corp, Digital Banking Ltd)
- 4 Customers (KYC001-KYC004) with various KYC statuses
- Sample KYC requests and bank authorizations
- All account addresses saved to `src/contracts/accounts.json`

5. **Configure MetaMask:**

Add Hardhat network to MetaMask:
- Network Name: **Hardhat Localhost**
- RPC URL: `http://127.0.0.1:8545`
- Chain ID: **31337**
- Currency Symbol: **ETH**

Import test accounts using private keys from Hardhat output:
- **Account #0**: Owner/Admin
- **Account #1-2**: Admins
- **Account #3-5**: Banks
- **Account #6-9**: Customers

6. **Start the app:**

```bash
npm run dev
```

7. **Open the app:**

Navigate to `http://localhost:5173` and connect MetaMask!

## 🎭 Testing Different Roles

Switch MetaMask accounts to test different user roles:

### 👑 Owner Dashboard (Account #0)
- ✅ Add/remove system admins
- ✅ Transfer contract ownership
- ✅ View system-wide statistics
- ✅ Monitor all activities

### 🛡️ Admin Dashboard (Accounts #1-2)
- ✅ Register and approve banks
- ✅ Add new customers to the system
- ✅ Approve/reject bank KYC requests
- ✅ Authorize bank access to customer data
- ✅ Manage KYC authorizations

### 🏦 Bank Dashboard (Accounts #3-5)
- ✅ Request access to customer KYC data
- ✅ View authorized customer profiles
- ✅ Update customer KYC records
- ✅ Update KYC verification status (Accept/Reject/Revoke)
- ✅ View pending requests

### 👤 Customer View (Accounts #6-9)
- ✅ View personal KYC status
- ✅ View complete KYC history
- ✅ See authorized banks
- ✅ View submitted documents and records

## 📜 Smart Contract Overview

**Contract Location:** `contracts/KYC.sol`

### 🔑 Key Functions

**Owner Functions:**
- `setOwner()` - Transfer ownership
- `addAdmin()` / `removeAdmin()` - Admin management

**Admin Functions:**
- `addBank()` - Register banks
- `addCustomer()` - Register customers
- `updateRecord()` - Update KYC records
- `manageRequest()` - Approve/reject requests
- `addAuth()` / `revokeAuth()` - Manage authorizations

**Bank Functions:**
- `addRequest()` / `removeRequest()` - Request customer access
- `updateKycStatus()` - Update verification status

**View Functions:**
- `getCustomerDetails()` - Retrieve customer info
- `getCustomerRecordsCount()` - Count records
- `getKycHistoryCount()` - View history

## 📁 Project Structure

```
kyc-management-system/
├── contracts/              # 📝 Solidity smart contracts
│   └── KYC.sol            # Main KYC contract
│
├── scripts/               # 🔧 Hardhat scripts
│   ├── deploy.cjs         # Contract deployment
│   └── seed.cjs           # Dummy data seeding
│
├── src/
│   ├── components/        # ⚛️ React components
│   │   ├── admin/         # Admin panel components
│   │   ├── ui/            # Reusable UI components (shadcn)
│   │   ├── *Dashboard.tsx # Role-specific dashboards
│   │   ├── RoleSelector.tsx
│   │   └── WalletConnect.tsx
│   │
│   ├── contexts/          # 🔄 React contexts
│   │   └── Web3Context.tsx # Blockchain state management
│   │
│   ├── lib/               # 🛠️ Utilities
│   │   ├── contractHelpers.ts # Smart contract helpers
│   │   └── utils.ts
│   │
│   ├── contracts/         # 📦 Generated artifacts
│   │   ├── KYC.json       # Contract ABI
│   │   ├── contract-address.json
│   │   └── accounts.json  # Test account addresses
│   │
│   ├── pages/             # 📄 Page components
│   │   └── Index.tsx
│   │
│   └── index.css          # 🎨 Global styles + design system
│
├── hardhat.config.cjs     # ⚙️ Hardhat configuration
├── vite.config.ts         # ⚙️ Vite configuration
└── tailwind.config.ts     # 🎨 Tailwind configuration
```

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TypeScript, Vite |
| **Styling** | Tailwind CSS, shadcn/ui |
| **Blockchain** | Ethereum, Solidity ^0.8.24 |
| **Smart Contracts** | Hardhat, ethers.js v6 |
| **State** | React Context API |
| **Notifications** | Sonner |
| **Icons** | Lucide React |

## 🐛 Troubleshooting

### 🔴 MetaMask Won't Connect
- ✅ Verify Hardhat node is running on `http://127.0.0.1:8545`
- ✅ Confirm MetaMask network: Chain ID **31337**
- ✅ Reset MetaMask account: Settings → Advanced → Reset Account

### 🔴 Transactions Failing
- ✅ Ensure account has test ETH (all Hardhat accounts come with 10000 ETH)
- ✅ Check you're using the correct role account
- ✅ Verify contract is deployed: `src/contracts/contract-address.json` exists

### 🔴 "No Data Found" After Connecting
- ✅ Run the seed script: `npx hardhat run scripts/seed.cjs --network localhost`
- ✅ Verify accounts.json was created in `src/contracts/`

### 🔴 Hardhat Node Restart
After restarting Hardhat, you **must** redeploy:
```bash
# Terminal 1: Restart node
npx hardhat node

# Terminal 2: Redeploy & reseed
npx hardhat run scripts/deploy.cjs --network localhost
npx hardhat run scripts/seed.cjs --network localhost

# Then reset MetaMask account to clear old nonces
```

## 📝 License

MIT License - feel free to use this project for learning and development!
