import { Shield, Building2, UserCheck, User, Sparkles, Lock, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import WalletConnect from "./WalletConnect";
import { useWeb3 } from "@/contexts/Web3Context";
interface RoleSelectorProps {
  onSelectRole: (role: string) => void;
}
const roles = [{
  id: "owner",
  title: "Owner",
  description: "Manage system administrators and ownership",
  icon: Shield,
  gradient: "from-blue-500 to-blue-600"
}, {
  id: "admin",
  title: "Admin",
  description: "Manage banks, customers, and KYC requests",
  icon: UserCheck,
  gradient: "from-purple-500 to-purple-600"
}, {
  id: "bank",
  title: "Bank",
  description: "Request access and manage KYC records",
  icon: Building2,
  gradient: "from-green-500 to-green-600"
}, {
  id: "customer",
  title: "Customer",
  description: "View your KYC status and history",
  icon: User,
  gradient: "from-orange-500 to-orange-600"
}];
const RoleSelector = ({
  onSelectRole
}: RoleSelectorProps) => {
  const {
    account
  } = useWeb3();
  return <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-primary/5 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" style={{
      animationDelay: "1s"
    }} />
      
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center animate-pulse-glow">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold">KYC Chain</span>
        </div>
        <WalletConnect />
      </div>

      {/* Main content */}
      <div className="flex items-center justify-center min-h-screen p-6 relative z-10">
        <div className="w-full max-w-6xl">
          {/* Hero section */}
          <div className="text-center mb-16 animate-fade-in">
            
            
            
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Secure, transparent, and efficient identity verification powered by Ethereum blockchain
            </p>

            {account && <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-sm font-mono text-muted-foreground">
                  {account.slice(0, 8)}...{account.slice(-6)}
                </span>
              </div>}
          </div>

          {/* Role cards */}
          <div className="mb-8 animate-fade-in" style={{
          animationDelay: "200ms"
        }}>
            <h2 className="text-2xl font-semibold text-center mb-8 text-foreground">
              Select Your Role
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {roles.map((role, index) => <Card key={role.id} className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-elevated border-2 hover:border-primary/50 backdrop-blur-sm bg-card/80 animate-fade-in" style={{
              animationDelay: `${300 + index * 100}ms`
            }} onClick={() => onSelectRole(role.id)}>
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${role.gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow`}>
                      <role.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
                      {role.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {role.description}
                    </p>
                  </CardContent>
                </Card>)}
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 animate-fade-in" style={{
          animationDelay: "700ms"
        }}>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Lock className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-foreground">Secure</p>
                <p className="text-sm text-muted-foreground">End-to-end encryption</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Globe className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-foreground">Decentralized</p>
                <p className="text-sm text-muted-foreground">On Ethereum blockchain</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-foreground">Transparent</p>
                <p className="text-sm text-muted-foreground">Immutable audit trail</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default RoleSelector;