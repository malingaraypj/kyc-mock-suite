import { useState } from "react";
import RoleSelector from "@/components/RoleSelector";
import OwnerDashboard from "@/components/OwnerDashboard";
import AdminDashboard from "@/components/AdminDashboard";
import BankDashboard from "@/components/BankDashboard";
import CustomerView from "@/components/CustomerView";
import WalletConnect from "@/components/WalletConnect";
import { useWeb3 } from "@/contexts/Web3Context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const { isConnected } = useWeb3();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
  };

  const handleBack = () => {
    setSelectedRole(null);
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">KYC Management System</CardTitle>
            <CardDescription>Connect your wallet to continue</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <WalletConnect />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (selectedRole === "owner") {
    return <OwnerDashboard onBack={handleBack} />;
  }

  if (selectedRole === "admin") {
    return <AdminDashboard onBack={handleBack} />;
  }

  if (selectedRole === "bank") {
    return <BankDashboard onBack={handleBack} />;
  }

  if (selectedRole === "customer") {
    return <CustomerView onBack={handleBack} />;
  }

  return <RoleSelector onSelectRole={handleRoleSelect} />;
};

export default Index;
