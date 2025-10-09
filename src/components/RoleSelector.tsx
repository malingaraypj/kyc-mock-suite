import { Shield, Building2, UserCheck, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface RoleSelectorProps {
  onSelectRole: (role: string) => void;
}

const roles = [
  {
    id: "owner",
    title: "Owner",
    description: "Manage system administrators and ownership",
    icon: Shield,
    gradient: "from-blue-500 to-blue-600"
  },
  {
    id: "admin",
    title: "Admin",
    description: "Manage banks, customers, and KYC requests",
    icon: UserCheck,
    gradient: "from-purple-500 to-purple-600"
  },
  {
    id: "bank",
    title: "Bank",
    description: "Request access and manage KYC records",
    icon: Building2,
    gradient: "from-green-500 to-green-600"
  },
  {
    id: "customer",
    title: "Customer",
    description: "View your KYC status and history",
    icon: User,
    gradient: "from-orange-500 to-orange-600"
  }
];

const RoleSelector = ({ onSelectRole }: RoleSelectorProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background flex items-center justify-center p-6">
      <div className="w-full max-w-6xl">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            KYC Management System
          </h1>
          <p className="text-xl text-muted-foreground">
            Select your role to access the dashboard
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {roles.map((role, index) => (
            <Card
              key={role.id}
              className="cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-elevated border-2 hover:border-primary animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => onSelectRole(role.id)}
            >
              <CardContent className="p-6 text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${role.gradient} flex items-center justify-center shadow-lg`}>
                  <role.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">
                  {role.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {role.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: "400ms" }}>
          <p>🔒 Secure • Decentralized • Transparent</p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelector;
