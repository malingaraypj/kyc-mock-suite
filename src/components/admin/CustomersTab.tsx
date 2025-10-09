import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, Plus, Eye } from "lucide-react";
import { mockData, Customer } from "@/data/mockData";
import StatusBadge from "../StatusBadge";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const CustomersTab = () => {
  const [customers, setCustomers] = useState<Customer[]>(mockData.customers);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    pan: "",
    kycId: "",
    email: "",
    phone: ""
  });
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  const handleAddCustomer = () => {
    if (!newCustomer.name.trim() || !newCustomer.pan.trim() || !newCustomer.kycId.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    const customer: Customer = {
      ...newCustomer,
      kycStatus: 0
    };

    setCustomers([...customers, customer]);
    setNewCustomer({ name: "", pan: "", kycId: "", email: "", phone: "" });
    toast.success("Customer added successfully");
  };

  const viewCustomerDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowDetailsDialog(true);
  };

  const customerRecords = mockData.kycRecords.filter(r => r.kycId === selectedCustomer?.kycId);
  const customerHistory = mockData.kycHistory.filter(h => h.kycId === selectedCustomer?.kycId);

  return (
    <div className="grid gap-6">
      {/* Add Customer Card */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" />
            Add New Customer
          </CardTitle>
          <CardDescription>Register a new customer in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="customer-name">Name *</Label>
              <Input
                id="customer-name"
                placeholder="Enter full name"
                value={newCustomer.name}
                onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="customer-pan">PAN Number *</Label>
              <Input
                id="customer-pan"
                placeholder="ABCDE1234F"
                value={newCustomer.pan}
                onChange={(e) => setNewCustomer({ ...newCustomer, pan: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="customer-kyc">KYC ID *</Label>
              <Input
                id="customer-kyc"
                placeholder="KYC001"
                value={newCustomer.kycId}
                onChange={(e) => setNewCustomer({ ...newCustomer, kycId: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="customer-email">Email</Label>
              <Input
                id="customer-email"
                type="email"
                placeholder="customer@email.com"
                value={newCustomer.email}
                onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="customer-phone">Phone</Label>
              <Input
                id="customer-phone"
                placeholder="+1 (555) 000-0000"
                value={newCustomer.phone}
                onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleAddCustomer} className="w-full bg-gradient-primary hover:opacity-90">
                <Plus className="h-4 w-4 mr-2" />
                Add Customer
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customers List Card */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Registered Customers
          </CardTitle>
          <CardDescription>
            {customers.length} {customers.length === 1 ? "customer" : "customers"} in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {customers.map((customer) => (
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
                  View
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Customer Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
            <DialogDescription>Comprehensive customer information and history</DialogDescription>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-6">
              {/* Basic Info */}
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
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-sm font-medium text-muted-foreground">Status</span>
                  <StatusBadge status={selectedCustomer.kycStatus} />
                </div>
                {selectedCustomer.email && (
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-sm font-medium text-muted-foreground">Email</span>
                    <span>{selectedCustomer.email}</span>
                  </div>
                )}
                {selectedCustomer.phone && (
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-sm font-medium text-muted-foreground">Phone</span>
                    <span>{selectedCustomer.phone}</span>
                  </div>
                )}
              </div>

              {/* KYC Records */}
              <div>
                <h3 className="font-semibold mb-3">KYC Records</h3>
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
                <h3 className="font-semibold mb-3">KYC History</h3>
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
    </div>
  );
};

export default CustomersTab;
