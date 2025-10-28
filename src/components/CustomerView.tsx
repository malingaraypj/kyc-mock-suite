import { useState, useEffect } from "react";
import DashboardLayout from "./DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, FileText, History, Send, Building2 } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { useWeb3 } from "@/contexts/Web3Context";
import { getCustomerRecords, getKycHistory, getAllBanks, Customer, KYCRecord, KYCHistory, Bank } from "@/lib/contractHelpers";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { toast } from "sonner";

interface CustomerViewProps {
  onBack: () => void;
}

const CustomerView = ({ onBack }: CustomerViewProps) => {
  const { contract } = useWeb3();
  const [kycId, setKycId] = useState("");
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [records, setRecords] = useState<KYCRecord[]>([]);
  const [history, setHistory] = useState<KYCHistory[]>([]);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [requestingBank, setRequestingBank] = useState<string | null>(null);

  useEffect(() => {
    loadBanks();
  }, [contract]);

  const loadBanks = async () => {
    if (!contract) return;
    try {
      const allBanks = await getAllBanks(contract);
      setBanks(allBanks.filter(b => b.isApproved));
    } catch (error) {
      console.error("Error loading banks:", error);
    }
  };

  const loadCustomerData = async () => {
    if (!contract || !kycId) {
      toast.error("Please enter a KYC ID");
      return;
    }

    try {
      const customerData = await contract.Customers(kycId);
      setCustomer({
        kycId: customerData.kycId,
        name: customerData.name,
        pan: customerData.pan,
        kycStatus: Number(customerData.kycStatus)
      });
      
      const customerRecords = await getCustomerRecords(contract, kycId);
      const customerHistory = await getKycHistory(contract, kycId);
      setRecords(customerRecords);
      setHistory(customerHistory);
      toast.success("Customer data loaded");
    } catch (error) {
      toast.error("Failed to load customer data");
      console.error(error);
    }
  };

  const handleRequestValidation = async (bankAddress: string) => {
    if (!contract || !kycId) {
      toast.error("Please load your customer data first");
      return;
    }

    setRequestingBank(bankAddress);
    try {
      toast.loading("Sending request to bank...");
      const tx = await contract.addRequest(kycId, { from: bankAddress });
      await tx.wait();
      toast.dismiss();
      toast.success("Validation request sent successfully");
    } catch (error: any) {
      toast.dismiss();
      if (error.message?.includes("RequestExists")) {
        toast.error("Request already exists or bank is already authorized");
      } else {
        toast.error("Failed to send validation request");
      }
      console.error(error);
    } finally {
      setRequestingBank(null);
    }
  };

  return (
    <DashboardLayout
      title="Customer View"
      subtitle="View your KYC information and verification history"
      onBack={onBack}
    >
      <div className="grid gap-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Load Customer Data</CardTitle>
            <CardDescription>Enter your KYC ID to view your information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="kyc-id">KYC ID</Label>
                <Input
                  id="kyc-id"
                  placeholder="Enter your KYC ID"
                  value={kycId}
                  onChange={(e) => setKycId(e.target.value)}
                />
              </div>
              <Button onClick={loadCustomerData} className="mt-auto bg-gradient-primary">
                Load Data
              </Button>
            </div>
          </CardContent>
        </Card>

        {customer && (
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="request">Request KYC</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>Your registered KYC details</CardDescription>
                </CardHeader>
                <CardContent>
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
                      <span className="text-sm font-medium text-muted-foreground">PAN Number</span>
                      <span className="font-mono">{customer.pan}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-muted-foreground">KYC Status</span>
                      <StatusBadge status={customer.kycStatus} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents" className="space-y-4">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    KYC Documents
                  </CardTitle>
                  <CardDescription>
                    {records.length} {records.length === 1 ? "document" : "documents"} uploaded
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {records.length > 0 ? (
                      records.map((record, idx) => (
                        <div
                          key={idx}
                          className="p-4 bg-accent/50 border rounded-lg hover:border-primary/50 transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-semibold text-foreground mb-1">{record.recordType}</h4>
                              <p className="text-sm text-muted-foreground font-mono break-all">
                                IPFS Hash: {record.ipfsHash}
                              </p>
                            </div>
                            <span className="text-sm text-muted-foreground whitespace-nowrap ml-4">
                              {new Date(record.timestamp * 1000).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground py-8">
                        No documents uploaded yet
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5 text-primary" />
                    Verification History
                  </CardTitle>
                  <CardDescription>
                    {history.length} {history.length === 1 ? "verification" : "verifications"} performed
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {history.length > 0 ? (
                      history.map((entry, idx) => (
                        <div
                          key={idx}
                          className="p-4 bg-accent/50 border rounded-lg hover:border-primary/50 transition-colors"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <h4 className="font-semibold text-foreground">{entry.bankName}</h4>
                            <StatusBadge status={entry.verdict} />
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{entry.remarks}</p>
                          <span className="text-xs text-muted-foreground">
                            {new Date(entry.timestamp * 1000).toLocaleString()}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground py-8">
                        No verification history yet
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="request" className="space-y-4">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Send className="h-5 w-5 text-primary" />
                    Request KYC Validation
                  </CardTitle>
                  <CardDescription>
                    Select a bank to request KYC validation from
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {banks.length > 0 ? (
                      banks.map((bank) => (
                        <div
                          key={bank.addr}
                          className="p-4 bg-accent/50 border rounded-lg hover:border-primary/50 transition-all group"
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Building2 className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-foreground">{bank.bName}</h4>
                                <p className="text-xs text-muted-foreground font-mono">
                                  {bank.addr.slice(0, 6)}...{bank.addr.slice(-4)}
                                </p>
                              </div>
                            </div>
                            <Button
                              onClick={() => handleRequestValidation(bank.addr)}
                              disabled={requestingBank === bank.addr}
                              size="sm"
                              className="bg-gradient-primary"
                            >
                              {requestingBank === bank.addr ? "Sending..." : "Request"}
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground py-8">
                        No banks available
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CustomerView;
