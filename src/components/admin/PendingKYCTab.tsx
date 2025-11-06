import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, FileText, User, CreditCard } from "lucide-react";
import { useWeb3 } from "@/contexts/Web3Context";
import { toast } from "sonner";
import { getAllCustomers, Customer, getCustomerRecords, KYCRecord } from "@/lib/contractHelpers";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import StatusBadge from "../StatusBadge";

const PendingKYCTab = () => {
  const { contract } = useWeb3();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerRecords, setCustomerRecords] = useState<KYCRecord[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadCustomers();
  }, [contract]);

  const loadCustomers = async () => {
    if (!contract) return;
    try {
      const allCustomers = await getAllCustomers(contract);
      // Filter only pending customers
      setCustomers(allCustomers.filter(c => c.kycStatus === 0));
    } catch (error) {
      console.error("Error loading customers:", error);
      toast.error("Failed to load customers");
    }
  };

  const viewCustomerDetails = async (customer: Customer) => {
    if (!contract) return;
    try {
      const records = await getCustomerRecords(contract, customer.kycId);
      setCustomerRecords(records);
      setSelectedCustomer(customer);
      setIsDialogOpen(true);
    } catch (error) {
      console.error("Error loading customer records:", error);
      toast.error("Failed to load customer details");
    }
  };

  const handleApprove = async () => {
    if (!contract || !selectedCustomer) return;
    
    setIsProcessing(true);
    try {
      toast.loading("Approving KYC registration...");
      
      const vcHash = "0x" + "0".repeat(64);
      const tx = await contract.updateKycStatus(
        selectedCustomer.kycId,
        "Admin",
        "KYC documents verified and approved",
        Math.floor(Date.now() / 1000),
        1, // Accepted
        vcHash
      );
      
      await tx.wait();
      toast.dismiss();
      toast.success("KYC approved successfully");
      
      setIsDialogOpen(false);
      loadCustomers();
    } catch (error: any) {
      toast.dismiss();
      toast.error("Failed to approve KYC: " + error.message);
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!contract || !selectedCustomer) return;
    
    setIsProcessing(true);
    try {
      toast.loading("Rejecting KYC registration...");
      
      const vcHash = "0x" + "0".repeat(64);
      const tx = await contract.updateKycStatus(
        selectedCustomer.kycId,
        "Admin",
        "KYC documents incomplete or invalid",
        Math.floor(Date.now() / 1000),
        2, // Rejected
        vcHash
      );
      
      await tx.wait();
      toast.dismiss();
      toast.success("KYC rejected");
      
      setIsDialogOpen(false);
      loadCustomers();
    } catch (error: any) {
      toast.dismiss();
      toast.error("Failed to reject KYC: " + error.message);
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Pending KYC Registrations</CardTitle>
          <CardDescription>
            Review and approve customer KYC applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {customers.length > 0 ? (
              customers.map((customer) => (
                <div
                  key={customer.kycId}
                  className="flex items-center justify-between p-4 border rounded-lg hover:border-primary/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <h3 className="font-semibold">{customer.name}</h3>
                      <StatusBadge status={customer.kycStatus} />
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <FileText className="h-3 w-3" />
                        <span>KYC ID: {customer.kycId}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-3 w-3" />
                        <span>PAN: {customer.pan}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => viewCustomerDetails(customer)}
                    variant="outline"
                    size="sm"
                  >
                    Review
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No pending KYC registrations
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review KYC Application</DialogTitle>
            <DialogDescription>
              Review the customer details and uploaded documents
            </DialogDescription>
          </DialogHeader>
          
          {selectedCustomer && (
            <div className="space-y-6">
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Name</p>
                    <p className="text-lg font-semibold">{selectedCustomer.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <StatusBadge status={selectedCustomer.kycStatus} />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">KYC ID</p>
                    <p className="font-mono">{selectedCustomer.kycId}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">PAN Number</p>
                    <p className="font-mono">{selectedCustomer.pan}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-3">Uploaded Documents</h4>
                <div className="space-y-2">
                  {customerRecords.length > 0 ? (
                    customerRecords.map((record, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-accent/50 border rounded-lg"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{record.recordType}</p>
                            <p className="text-xs text-muted-foreground font-mono break-all mt-1">
                              Hash: {record.ipfsHash}
                            </p>
                          </div>
                          <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                            {new Date(record.timestamp * 1000).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No documents found
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button
                  onClick={handleApprove}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={isProcessing}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {isProcessing ? "Processing..." : "Approve"}
                </Button>
                <Button
                  onClick={handleReject}
                  variant="destructive"
                  className="flex-1"
                  disabled={isProcessing}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  {isProcessing ? "Processing..." : "Reject"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PendingKYCTab;
