import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWeb3 } from "@/contexts/Web3Context";
import accounts from "@/contracts/accounts.json";
import { Label } from "@/components/ui/label";

const AccountSwitcher = () => {
  const { account, switchAccount } = useWeb3();
  const [selectedAccount, setSelectedAccount] = useState<string>("");

  useEffect(() => {
    if (account) {
      setSelectedAccount(account);
    }
  }, [account]);

  const handleAccountChange = async (address: string) => {
    setSelectedAccount(address);
    await switchAccount(address);
  };

  const getAccountLabel = (address: string) => {
    if (address === accounts.owner) return "Owner";
    if (accounts.admins.includes(address)) return "Admin";
    const bank = accounts.banks.find(b => b.address === address);
    if (bank) return bank.name;
    const customer = accounts.customers.find(c => c.address === address);
    if (customer) return `Customer (${customer.kycId})`;
    return address.slice(0, 6) + "..." + address.slice(-4);
  };

  const allAccounts = [
    { address: accounts.owner, label: "Owner" },
    ...accounts.admins.map((addr, i) => ({ address: addr, label: `Admin ${i + 1}` })),
    ...accounts.banks.map(bank => ({ address: bank.address, label: bank.name })),
    ...accounts.customers.map(customer => ({ 
      address: customer.address, 
      label: `Customer (${customer.kycId})` 
    }))
  ];

  return (
    <div className="space-y-2">
      <Label>Switch Account (for testing)</Label>
      <Select value={selectedAccount} onValueChange={handleAccountChange}>
        <SelectTrigger className="font-mono">
          <SelectValue placeholder="Select account">
            {selectedAccount && getAccountLabel(selectedAccount)}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {allAccounts.map((acc) => (
            <SelectItem key={acc.address} value={acc.address} className="font-mono">
              {acc.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default AccountSwitcher;
