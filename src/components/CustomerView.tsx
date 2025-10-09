import DashboardLayout from "./DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, FileText, History } from "lucide-react";
import { mockData } from "@/data/mockData";
import StatusBadge from "./StatusBadge";

interface CustomerViewProps {
  onBack: () => void;
}

const CustomerView = ({ onBack }: CustomerViewProps) => {
  const customer = mockData.customers[0]; // Using first customer as example
  const records = mockData.kycRecords.filter(r => r.kycId === customer.kycId);
  const history = mockData.kycHistory.filter(h => h.kycId === customer.kycId);

  return (
    <DashboardLayout
      title="Customer View"
      subtitle="Your KYC information and verification history"
      onBack={onBack}
    >
      <div className="grid gap-6">
        {/* Personal Information Card */}
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
              {customer.email && (
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-sm font-medium text-muted-foreground">Email</span>
                  <span>{customer.email}</span>
                </div>
              )}
              {customer.phone && (
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-sm font-medium text-muted-foreground">Phone</span>
                  <span>{customer.phone}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">KYC Status</span>
                <StatusBadge status={customer.kycStatus} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KYC Documents Card */}
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
                        {new Date(record.timestamp).toLocaleDateString()}
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

        {/* Verification History Card */}
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
                      {new Date(entry.timestamp).toLocaleString()}
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
      </div>
    </DashboardLayout>
  );
};

export default CustomerView;
