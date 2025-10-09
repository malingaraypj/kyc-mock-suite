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
  kycStatus: number; // 0: Pending, 1: Accepted, 2: Rejected, 3: Revoked
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
  verdict: number; // 1: Accepted, 2: Rejected, 3: Revoked
  timestamp: number;
}

export interface KYCRequest {
  bank: string;
  kycId: string;
  timestamp: number;
}

export interface Authorization {
  bankAddr: string;
  kycId: string;
  isAuthorized: boolean;
}

export interface MockData {
  owner: string;
  admins: string[];
  banks: Bank[];
  customers: Customer[];
  kycRecords: KYCRecord[];
  kycHistory: KYCHistory[];
  requests: KYCRequest[];
  authorizations: Authorization[];
}

export const mockData: MockData = {
  owner: "0x1234567890abcdef1234567890abcdef12345678",
  admins: [
    "0xAdmin1234567890abcdef1234567890abcdef12",
    "0xAdmin2567890abcdef1234567890abcdef123456"
  ],
  banks: [
    { id: 1, bName: "Global Trust Bank", addr: "0xBank1234567890abcdef1234567890abcdef123", isApproved: true },
    { id: 2, bName: "Secure Finance Corp", addr: "0xBank2567890abcdef1234567890abcdef123456", isApproved: true },
    { id: 3, bName: "Digital Banking Ltd", addr: "0xBank3890abcdef1234567890abcdef1234567890", isApproved: false }
  ],
  customers: [
    { 
      kycId: "KYC001", 
      name: "Alice Johnson", 
      pan: "ABCDE1234F", 
      kycStatus: 1,
      email: "alice.johnson@email.com",
      phone: "+1 (555) 123-4567"
    },
    { 
      kycId: "KYC002", 
      name: "Bob Williams", 
      pan: "XYZAB5678C", 
      kycStatus: 2,
      email: "bob.williams@email.com",
      phone: "+1 (555) 234-5678"
    },
    { 
      kycId: "KYC003", 
      name: "Carol Martinez", 
      pan: "PQRST9012D", 
      kycStatus: 0,
      email: "carol.martinez@email.com",
      phone: "+1 (555) 345-6789"
    },
    { 
      kycId: "KYC004", 
      name: "David Chen", 
      pan: "LMNOP3456E", 
      kycStatus: 1,
      email: "david.chen@email.com",
      phone: "+1 (555) 456-7890"
    }
  ],
  kycRecords: [
    { kycId: "KYC001", recordType: "Identity Proof", ipfsHash: "QmX1abc...def123", timestamp: Date.now() - 86400000 * 7 },
    { kycId: "KYC001", recordType: "Address Proof", ipfsHash: "QmY2def...ghi456", timestamp: Date.now() - 86400000 * 6 },
    { kycId: "KYC002", recordType: "Identity Proof", ipfsHash: "QmZ3ghi...jkl789", timestamp: Date.now() - 86400000 * 5 },
    { kycId: "KYC003", recordType: "Identity Proof", ipfsHash: "QmA4jkl...mno012", timestamp: Date.now() - 86400000 * 2 },
    { kycId: "KYC004", recordType: "Identity Proof", ipfsHash: "QmB5mno...pqr345", timestamp: Date.now() - 86400000 * 10 },
    { kycId: "KYC004", recordType: "Financial Statement", ipfsHash: "QmC6pqr...stu678", timestamp: Date.now() - 86400000 * 9 }
  ],
  kycHistory: [
    { kycId: "KYC001", bankName: "Global Trust Bank", remarks: "All documents verified successfully", verdict: 1, timestamp: Date.now() - 86400000 * 5 },
    { kycId: "KYC002", bankName: "Secure Finance Corp", remarks: "Incomplete documentation provided", verdict: 2, timestamp: Date.now() - 86400000 * 3 },
    { kycId: "KYC004", bankName: "Global Trust Bank", remarks: "Customer profile verified and approved", verdict: 1, timestamp: Date.now() - 86400000 * 8 }
  ],
  requests: [
    { bank: "Digital Banking Ltd", kycId: "KYC003", timestamp: Date.now() - 86400000 * 1 },
    { bank: "Secure Finance Corp", kycId: "KYC001", timestamp: Date.now() - 86400000 * 2 }
  ],
  authorizations: [
    { bankAddr: "0xBank1234567890abcdef1234567890abcdef123", kycId: "KYC001", isAuthorized: true },
    { bankAddr: "0xBank2567890abcdef1234567890abcdef123456", kycId: "KYC002", isAuthorized: true },
    { bankAddr: "0xBank1234567890abcdef1234567890abcdef123", kycId: "KYC004", isAuthorized: true }
  ]
};
