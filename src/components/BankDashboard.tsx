import { useState, useEffect } from "react";
import DashboardLayout from "./DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, Send, CheckCircle2, Eye } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useWeb3 } from "@/contexts/Web3Context";
import { handleContractError, waitForTransaction, getCustomerRecords, getKycHistory, Customer, KYCRecord, KYCHistory } from "@/lib/contractHelpers";

interface BankDashboardProps {
  onBack: () => void;
}

const BankDashboard = ({ onBack }: BankDashboardProps) => {
  const { contract, account } = useWeb3();
  const [bankInfo, setBankInfo] = useState<any>(null);
  const [requestKycId, setRequestKycId] = useState("");
  const [updateKycId, setUpdateKycId] = useState("");
  const [remarks, setRemarks] = useState("");
  const [verdict, setVerdict] = useState<string>("");
  const [authorizedCustomers, setAuthorizedCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerRecords, setCustomerRecords] = useState<KYCRecord[]>([]);
  const [customerHistory, setCustomerHistory] = useState<KYCHistory[]>([]);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadBankData();
  }, [contract, account]);

  const loadBankData = async () => {
    if (!contract || !account) return;
    
    try {
      const bank = await contract.Banks(account);
      setBankInfo(bank);
      
      const approvals = bank.approvals || [];
      const customers: Customer[] = [];
      for (const kycId of approvals) {
        const customerData = await contract.Customers(kycId);
        customers.push({
          kycId: customerData.kycId,
          name: customerData.name,
          pan: customerData.pan,
          kycStatus: Number(customerData.kycStatus)
        });
      }
      setAuthorizedCustomers(customers);
    } catch (error) {
      console.error("Error loading bank data:", error);
    }
  };

  const handleRequestAccess = async () => {
    if (!contract || !requestKycId.trim()) {
      toast.error("Please enter a KYC ID");
      return;
    }

    setIsLoading(true);
    try {
      const tx = await contract.addRequest(requestKycId);
      await waitForTransaction(tx, `Access request sent for ${requestKycId}`);
      setRequestKycId("");
    } catch (error) {
      handleContractError(error, "Failed to send request");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!contract || !updateKycId || !remarks.trim() || !verdict) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const tx = await contract.updateKycStatus(
        updateKycId,
        bankInfo.bName,
        remarks,
        Math.floor(Date.now() / 1000),
        parseInt(verdict),
        "0x0000000000000000000000000000000000000000000000000000000000000000"
      );
      await waitForTransaction(tx, `KYC status updated for ${updateKycId}`);
      setUpdateKycId("");
      setRemarks("");
      setVerdict("");
      await loadBankData();
    } catch (error) {
      handleContractError(error, "Failed to update status");
    } finally {
      setIsLoading(false);
    }
  };

  const viewCustomerDetails = async (customer: Customer) => {
    if (!contract) return;
    setSelectedCustomer(customer);
    const records = await getCustomerRecords(contract, customer.kycId);
    const history = await getKycHistory(contract, customer.kycId);
    setCustomerRecords(records);
    setCustomerHistory(history);
    setShowDetailsDialog(true);
  };

  return (
    <DashboardLayout
      title="Bank Dashboard"
      subtitle={`${bankInfo?.bName || "Bank"} - Access and manage KYC records`}
      onBack={onBack}
    >
      <div className="grid gap-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Bank Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-sm font-medium text-muted-foreground">Bank Name</span>
                <span className="font-semibold">{bankInfo?.bName || "Loading..."}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-sm font-medium text-muted-foreground">Address</span>
                <span className="font-mono text-sm">{account}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">Status</span>
                {bankInfo?.isApproved ? (
                  <span className="flex items-center gap-1 text-success font-medium">
                    <CheckCircle2 className="h-4 w-4" />
                    Approved
                  </span>
                ) : (
                  <span className="text-warning font-medium">Pending Approval</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5 text-primary" />
              Request KYC Access
            </CardTitle>
            <CardDescription>Submit a request to access customer KYC data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="request-kyc">Customer KYC ID</Label>
                <Input
                  id="request-kyc"
                  placeholder="Enter KYC ID"
                  value={requestKycId}
                  onChange={(e) => setRequestKycId(e.target.value)}
                />
              </div>
              <Button
                onClick={handleRequestAccess}
                className="mt-auto bg-gradient-primary hover:opacity-90"
                disabled={isLoading}
              >
                <Send className="h-4 w-4 mr-2" />
                {isLoading ? "Sending..." : "Submit Request"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Authorized Customers</CardTitle>
            <CardDescription>
              {authorizedCustomers.length} {authorizedCustomers.length === 1 ? "customer" : "customers"} authorized
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {authorizedCustomers.length > 0 ? (
                authorizedCustomers.map((customer) => (
                  <div
                    key={customer.kycId}
                    className="flex items-center gap-4 p-4 bg-card border rounded-lg hover:border-primary/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">{customer.name}</h3>
                        <StatusBadge status={customer.kycStatus} />
                      </div>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>KYC: {customer.kycId}</span>
                        <span>PAN: {customer.pan}</span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => viewCustomerDetails(customer)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No authorized customers yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Update KYC Status</CardTitle>
            <CardDescription>Update the KYC verification status for a customer</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="update-kyc">Customer KYC ID</Label>
                <Select value={updateKycId} onValueChange={setUpdateKycId}>
                  <SelectTrigger id="update-kyc">
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {authorizedCustomers.map((customer) => (
                      <SelectItem key={customer.kycId} value={customer.kycId}>
                        {customer.name} ({customer.kycId})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="remarks">Remarks</Label>
                <Textarea
                  id="remarks"
                  placeholder="Enter verification remarks"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="verdict">Verdict</Label>
                <Select value={verdict} onValueChange={setVerdict}>
                  <SelectTrigger id="verdict">
                    <SelectValue placeholder="Select verdict" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Accepted</SelectItem>
                    <SelectItem value="2">Rejected</SelectItem>
                    <SelectItem value="3">Revoked</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={handleUpdateStatus} 
                className="bg-gradient-primary hover:opacity-90"
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Update Status"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
            <DialogDescription>KYC information and verification history</DialogDescription>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-6">
              <div className="grid gap-3">
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-sm font-medium text-muted-foreground">Name</span>
                  <span className="font-semibold">{selectedCustomer.name}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-sm font-medium text-muted-foreground">KYC ID</span>
                  <span className="font-mono">{selectedCustomer.kycId}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-sm font-medium text-muted-foreground">PAN</span>
                  <span className="font-mono">{selectedCustomer.pan}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">Status</span>
                  <StatusBadge status={selectedCustomer.kycStatus} />
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">KYC Documents</h3>
                <div className="space-y-2">
                  {customerRecords.length > 0 ? (
                    customerRecords.map((record, idx) => (
                      <div key={idx} className="p-3 bg-accent/50 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-sm">{record.recordType}</p>
                            <p className="text-xs text-muted-foreground font-mono">{record.ipfsHash}</p>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(record.timestamp * 1000).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No records available</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Verification History</h3>
                <div className="space-y-2">
                  {customerHistory.length > 0 ? (
                    customerHistory.map((entry, idx) => (
                      <div key={idx} className="p-3 bg-accent/50 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-medium text-sm">{entry.bankName}</p>
                          <StatusBadge status={entry.verdict} />
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{entry.remarks}</p>
                        <span className="text-xs text-muted-foreground">
                          {new Date(entry.timestamp * 1000).toLocaleString()}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No history available</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default BankDashboard;
