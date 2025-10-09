import { useState } from "react";
import DashboardLayout from "./DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, Send, CheckCircle2, Eye } from "lucide-react";
import { mockData } from "@/data/mockData";
import StatusBadge from "./StatusBadge";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface BankDashboardProps {
  onBack: () => void;
}

const BankDashboard = ({ onBack }: BankDashboardProps) => {
  const bank = mockData.banks[0]; // Using first bank as example
  const [requestKycId, setRequestKycId] = useState("");
  const [updateKycId, setUpdateKycId] = useState("");
  const [remarks, setRemarks] = useState("");
  const [verdict, setVerdict] = useState<string>("");
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  const authorizedCustomers = mockData.authorizations
    .filter(auth => auth.bankAddr === bank.addr && auth.isAuthorized)
    .map(auth => mockData.customers.find(c => c.kycId === auth.kycId))
    .filter(Boolean);

  const handleRequestAccess = () => {
    if (!requestKycId.trim()) {
      toast.error("Please enter a KYC ID");
      return;
    }
    toast.success(`Access request sent for ${requestKycId}`);
    setRequestKycId("");
  };

  const handleUpdateStatus = () => {
    if (!updateKycId || !remarks.trim() || !verdict) {
      toast.error("Please fill in all fields");
      return;
    }
    toast.success(`KYC status updated for ${updateKycId}`);
    setUpdateKycId("");
    setRemarks("");
    setVerdict("");
  };

  const viewCustomerDetails = (kycId: string) => {
    setSelectedCustomer(kycId);
    setShowDetailsDialog(true);
  };

  const customer = mockData.customers.find(c => c.kycId === selectedCustomer);
  const customerRecords = mockData.kycRecords.filter(r => r.kycId === selectedCustomer);
  const customerHistory = mockData.kycHistory.filter(h => h.kycId === selectedCustomer);

  return (
    <DashboardLayout
      title="Bank Dashboard"
      subtitle={`${bank.bName} - Access and manage KYC records`}
      onBack={onBack}
    >
      <div className="grid gap-6">
        {/* Bank Info Card */}
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
                <span className="font-semibold">{bank.bName}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-sm font-medium text-muted-foreground">Address</span>
                <span className="font-mono text-sm">{bank.addr}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">Status</span>
                {bank.isApproved ? (
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

        {/* Request KYC Access Card */}
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
              >
                <Send className="h-4 w-4 mr-2" />
                Submit Request
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Authorized Customers Card */}
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
                authorizedCustomers.map((customer: any) => (
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
                      onClick={() => viewCustomerDetails(customer.kycId)}
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

        {/* Update KYC Status Card */}
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
                    {authorizedCustomers.map((customer: any) => (
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
              <Button onClick={handleUpdateStatus} className="bg-gradient-primary hover:opacity-90">
                Update Status
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
            <DialogDescription>KYC information and verification history</DialogDescription>
          </DialogHeader>
          {customer && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid gap-3">
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-sm font-medium text-muted-foreground">Name</span>
                  <span className="font-semibold">{customer.name}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-sm font-medium text-muted-foreground">KYC ID</span>
                  <span className="font-mono">{customer.kycId}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-sm font-medium text-muted-foreground">PAN</span>
                  <span className="font-mono">{customer.pan}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">Status</span>
                  <StatusBadge status={customer.kycStatus} />
                </div>
              </div>

              {/* KYC Records */}
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
                            {new Date(record.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No records available</p>
                  )}
                </div>
              </div>

              {/* KYC History */}
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
                          {new Date(entry.timestamp).toLocaleString()}
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
