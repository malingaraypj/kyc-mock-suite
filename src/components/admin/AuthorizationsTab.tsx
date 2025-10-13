import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Plus, ShieldOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useWeb3 } from "@/contexts/Web3Context";
import { getAllBanks, getAllCustomers, handleContractError, waitForTransaction, Bank, Customer } from "@/lib/contractHelpers";

interface Authorization {
  bankAddr: string;
  bankName: string;
  kycId: string;
  customerName: string;
  isAuthorized: boolean;
}

const AuthorizationsTab = () => {
  const { contract } = useWeb3();
  const [banks, setBanks] = useState<Bank[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [authorizations, setAuthorizations] = useState<Authorization[]>([]);
  const [selectedBank, setSelectedBank] = useState<string>("");
  const [selectedKycId, setSelectedKycId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, [contract]);

  const loadData = async () => {
    if (!contract) return;
    
    const banksData = await getAllBanks(contract);
    const customersData = await getAllCustomers(contract);
    setBanks(banksData);
    setCustomers(customersData);
    
    // Load authorizations
    const authList: Authorization[] = [];
    for (const bank of banksData) {
      for (const customer of customersData) {
        const isAuth = await contract.isBankAuthorized(customer.kycId, bank.addr);
        if (isAuth) {
          authList.push({
            bankAddr: bank.addr,
            bankName: bank.bName,
            kycId: customer.kycId,
            customerName: customer.name,
            isAuthorized: true
          });
        }
      }
    }
    setAuthorizations(authList);
  };

  const handleGrantAccess = async () => {
    if (!contract || !selectedBank || !selectedKycId) {
      toast.error("Please select both bank and customer");
      return;
    }

    setIsLoading(true);
    try {
      const tx = await contract.addAuth(selectedKycId, selectedBank);
      await waitForTransaction(tx, "Access granted successfully");
      setSelectedBank("");
      setSelectedKycId("");
      await loadData();
    } catch (error) {
      handleContractError(error, "Failed to grant access");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevokeAccess = async (kycId: string, bankAddr: string) => {
    if (!contract) return;

    setIsLoading(true);
    try {
      const tx = await contract.revokeAuth(kycId, bankAddr);
      await waitForTransaction(tx, "Access revoked successfully");
      await loadData();
    } catch (error) {
      handleContractError(error, "Failed to revoke access");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-6">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" />
            Grant Bank Access
          </CardTitle>
          <CardDescription>Authorize a bank to access customer KYC data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="grid gap-2">
              <Label htmlFor="select-bank">Select Bank</Label>
              <Select value={selectedBank} onValueChange={setSelectedBank}>
                <SelectTrigger id="select-bank">
                  <SelectValue placeholder="Choose a bank" />
                </SelectTrigger>
                <SelectContent>
                  {banks
                    .filter(bank => bank.isApproved)
                    .map((bank) => (
                      <SelectItem key={bank.addr} value={bank.addr}>
                        {bank.bName}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="select-customer">Select Customer</Label>
              <Select value={selectedKycId} onValueChange={setSelectedKycId}>
                <SelectTrigger id="select-customer">
                  <SelectValue placeholder="Choose a customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.kycId} value={customer.kycId}>
                      {customer.name} ({customer.kycId})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button 
                onClick={handleGrantAccess} 
                className="w-full bg-gradient-primary hover:opacity-90"
                disabled={isLoading}
              >
                <Plus className="h-4 w-4 mr-2" />
                {isLoading ? "Granting..." : "Grant Access"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Access Authorizations
          </CardTitle>
          <CardDescription>
            {authorizations.length} {authorizations.length === 1 ? "authorization" : "authorizations"} configured
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {authorizations.length > 0 ? (
              authorizations.map((auth, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-card border rounded-lg hover:border-primary/50 transition-colors"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    {auth.isAuthorized ? (
                      <ShieldCheck className="h-5 w-5 text-success" />
                    ) : (
                      <ShieldOff className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground">
                        {auth.bankName}
                      </h3>
                      {auth.isAuthorized ? (
                        <Badge variant="success">Active</Badge>
                      ) : (
                        <Badge variant="secondary">Revoked</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Customer: {auth.customerName}
                    </p>
                  </div>
                  {auth.isAuthorized && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRevokeAccess(auth.kycId, auth.bankAddr)}
                      className="text-destructive hover:text-destructive"
                      disabled={isLoading}
                    >
                      <ShieldOff className="h-4 w-4 mr-2" />
                      Revoke
                    </Button>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <ShieldCheck className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">No authorizations configured</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthorizationsTab;
