import { useState } from "react";
import DashboardLayout from "./DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, UserPlus, UserMinus, Copy, Check } from "lucide-react";
import { mockData } from "@/data/mockData";
import { toast } from "sonner";

interface OwnerDashboardProps {
  onBack: () => void;
}

const OwnerDashboard = ({ onBack }: OwnerDashboardProps) => {
  const [admins, setAdmins] = useState(mockData.admins);
  const [newAdminAddress, setNewAdminAddress] = useState("");
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const handleAddAdmin = () => {
    if (!newAdminAddress.trim()) {
      toast.error("Please enter an admin address");
      return;
    }
    if (admins.includes(newAdminAddress)) {
      toast.error("Admin already exists");
      return;
    }
    setAdmins([...admins, newAdminAddress]);
    setNewAdminAddress("");
    toast.success("Admin added successfully");
  };

  const handleRemoveAdmin = (address: string) => {
    setAdmins(admins.filter(admin => admin !== address));
    toast.success("Admin removed successfully");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(text);
    setTimeout(() => setCopiedAddress(null), 2000);
    toast.success("Address copied to clipboard");
  };

  return (
    <DashboardLayout
      title="Owner Dashboard"
      subtitle="Manage system administrators and ownership"
      onBack={onBack}
    >
      <div className="grid gap-6">
        {/* Current Owner Card */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Current Owner
            </CardTitle>
            <CardDescription>The current system owner address</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 p-4 bg-accent/50 rounded-lg font-mono text-sm">
              <span className="flex-1 truncate">{mockData.owner}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => copyToClipboard(mockData.owner)}
              >
                {copiedAddress === mockData.owner ? (
                  <Check className="h-4 w-4 text-success" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Add Admin Card */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" />
              Add Administrator
            </CardTitle>
            <CardDescription>Add a new admin to the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="admin-address">Admin Address</Label>
                <Input
                  id="admin-address"
                  placeholder="0x..."
                  value={newAdminAddress}
                  onChange={(e) => setNewAdminAddress(e.target.value)}
                  className="font-mono"
                />
              </div>
              <Button
                onClick={handleAddAdmin}
                className="mt-auto bg-gradient-primary hover:opacity-90"
              >
                Add Admin
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Current Admins Card */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserMinus className="h-5 w-5 text-primary" />
              Current Administrators
            </CardTitle>
            <CardDescription>
              {admins.length} {admins.length === 1 ? "administrator" : "administrators"} in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {admins.map((admin, index) => (
                <div
                  key={admin}
                  className="flex items-center gap-3 p-4 bg-card border rounded-lg hover:border-primary/50 transition-colors"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                    {index + 1}
                  </div>
                  <span className="flex-1 font-mono text-sm truncate">{admin}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToClipboard(admin)}
                  >
                    {copiedAddress === admin ? (
                      <Check className="h-4 w-4 text-success" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveAdmin(admin)}
                    className="text-destructive hover:text-destructive"
                  >
                    Remove
                  </Button>
                </div>
              ))}
              {admins.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No administrators added yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default OwnerDashboard;
