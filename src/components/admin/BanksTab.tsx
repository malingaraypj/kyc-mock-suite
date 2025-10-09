import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Building2, Plus, CheckCircle2, XCircle } from "lucide-react";
import { mockData, Bank } from "@/data/mockData";
import { toast } from "sonner";

const BanksTab = () => {
  const [banks, setBanks] = useState<Bank[]>(mockData.banks);
  const [newBankName, setNewBankName] = useState("");
  const [newBankAddress, setNewBankAddress] = useState("");

  const handleAddBank = () => {
    if (!newBankName.trim() || !newBankAddress.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    const newBank: Bank = {
      id: banks.length + 1,
      bName: newBankName,
      addr: newBankAddress,
      isApproved: false
    };

    setBanks([...banks, newBank]);
    setNewBankName("");
    setNewBankAddress("");
    toast.success("Bank added successfully");
  };

  const toggleBankApproval = (bankId: number) => {
    setBanks(banks.map(bank => 
      bank.id === bankId ? { ...bank, isApproved: !bank.isApproved } : bank
    ));
    toast.success("Bank status updated");
  };

  return (
    <div className="grid gap-6">
      {/* Add Bank Card */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" />
            Add New Bank
          </CardTitle>
          <CardDescription>Register a new bank in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="bank-name">Bank Name</Label>
              <Input
                id="bank-name"
                placeholder="Enter bank name"
                value={newBankName}
                onChange={(e) => setNewBankName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bank-address">Bank Address</Label>
              <Input
                id="bank-address"
                placeholder="0x..."
                value={newBankAddress}
                onChange={(e) => setNewBankAddress(e.target.value)}
                className="font-mono"
              />
            </div>
            <Button onClick={handleAddBank} className="bg-gradient-primary hover:opacity-90">
              <Plus className="h-4 w-4 mr-2" />
              Add Bank
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Banks List Card */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Registered Banks
          </CardTitle>
          <CardDescription>
            {banks.length} {banks.length === 1 ? "bank" : "banks"} in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {banks.map((bank) => (
              <div
                key={bank.id}
                className="flex items-center gap-4 p-4 bg-card border rounded-lg hover:border-primary/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground">{bank.bName}</h3>
                    {bank.isApproved ? (
                      <Badge variant="success">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Approved
                      </Badge>
                    ) : (
                      <Badge variant="warning">
                        <XCircle className="h-3 w-3 mr-1" />
                        Pending
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground font-mono truncate">
                    {bank.addr}
                  </p>
                </div>
                <Button
                  variant={bank.isApproved ? "outline" : "default"}
                  size="sm"
                  onClick={() => toggleBankApproval(bank.id)}
                  className={bank.isApproved ? "" : "bg-gradient-primary hover:opacity-90"}
                >
                  {bank.isApproved ? "Revoke" : "Approve"}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BanksTab;
