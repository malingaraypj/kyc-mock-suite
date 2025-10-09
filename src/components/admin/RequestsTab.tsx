import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileCheck, CheckCircle2, XCircle, Clock } from "lucide-react";
import { mockData, KYCRequest } from "@/data/mockData";
import { toast } from "sonner";

const RequestsTab = () => {
  const [requests, setRequests] = useState<KYCRequest[]>(mockData.requests);

  const handleApproveRequest = (index: number) => {
    const request = requests[index];
    setRequests(requests.filter((_, i) => i !== index));
    toast.success(`KYC request approved for ${request.kycId}`);
  };

  const handleRejectRequest = (index: number) => {
    const request = requests[index];
    setRequests(requests.filter((_, i) => i !== index));
    toast.error(`KYC request rejected for ${request.kycId}`);
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileCheck className="h-5 w-5 text-primary" />
          Pending KYC Requests
        </CardTitle>
        <CardDescription>
          {requests.length} pending {requests.length === 1 ? "request" : "requests"} from banks
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {requests.length > 0 ? (
            requests.map((request, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 bg-card border rounded-lg hover:border-primary/50 transition-colors"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-warning" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground">{request.bank}</h3>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>KYC ID: {request.kycId}</span>
                    <span>{new Date(request.timestamp).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRejectRequest(index)}
                    className="text-destructive hover:text-destructive hover:border-destructive"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleApproveRequest(index)}
                    className="bg-success hover:bg-success/90 text-success-foreground"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <FileCheck className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">No pending requests</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RequestsTab;
