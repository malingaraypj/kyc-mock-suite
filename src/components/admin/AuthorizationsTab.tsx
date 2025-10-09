import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Plus, ShieldOff } from "lucide-react";
import { mockData, Authorization } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const AuthorizationsTab = () => {
  const [authorizations, setAuthorizations] = useState<Authorization[]>(mockData.authorizations);
  const [selectedBank, setSelectedBank] = useState<string>("");
  const [selectedKycId, setSelectedKycId] = useState<string>("");

  const handleGrantAccess = () => {
    if (!selectedBank || !selectedKycId) {
      toast.error("Please select both bank and customer");
      return;
    }

    const exists = authorizations.find(
      auth => auth.bankAddr === selectedBank && auth.kycId === selectedKycId
    );

    if (exists) {
      toast.error("Authorization already exists");
      return;
    }

    const newAuth: Authorization = {
      bankAddr: selectedBank,
      kycId: selectedKycId,
      isAuthorized: true
    };

    setAuthorizations([...authorizations, newAuth]);
    setSelectedBank("");
    setSelectedKycId("");
    toast.success("Access granted successfully");
  };

  const handleRevokeAccess = (index: number) => {
    const auth = authorizations[index];
    setAuthorizations(
      authorizations.map((a, i) => 
        i === index ? { ...a, isAuthorized: false } : a
      )
    );
    toast.success("Access revoked successfully");
  };

  const getBankName = (addr: string) => {
    return mockData.banks.find(b => b.addr === addr)?.bName || addr;
  };

  const getCustomerName = (kycId: string) => {
    return mockData.customers.find(c => c.kycId === kycId)?.name || kycId;
  };

  return (
    <div className="grid gap-6">
      {/* Grant Access Card */}
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
                  {mockData.banks
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
                  {mockData.customers.map((customer) => (
                    <SelectItem key={customer.kycId} value={customer.kycId}>
                      {customer.name} ({customer.kycId})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={handleGrantAccess} className="w-full bg-gradient-primary hover:opacity-90">
                <Plus className="h-4 w-4 mr-2" />
                Grant Access
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Authorizations List Card */}
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
                        {getBankName(auth.bankAddr)}
                      </h3>
                      {auth.isAuthorized ? (
                        <Badge variant="success">Active</Badge>
                      ) : (
                        <Badge variant="secondary">Revoked</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Customer: {getCustomerName(auth.kycId)}
                    </p>
                  </div>
                  {auth.isAuthorized && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRevokeAccess(index)}
                      className="text-destructive hover:text-destructive"
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
