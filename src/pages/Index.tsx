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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-accent/20 to-primary/5 relative overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
        
        <Card className="w-full max-w-md mx-4 backdrop-blur-sm bg-card/90 border-2 relative z-10 animate-fade-in shadow-elevated">
          <CardHeader className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-primary flex items-center justify-center animate-pulse-glow shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              KYC Management System
            </CardTitle>
            <CardDescription className="text-base">
              Connect your Ethereum wallet to access the blockchain-powered KYC platform
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4 pt-2">
            <WalletConnect />
            <div className="text-xs text-muted-foreground text-center">
              Make sure you're connected to the Hardhat local network
            </div>
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
