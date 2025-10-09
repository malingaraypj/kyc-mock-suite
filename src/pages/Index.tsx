import { useState } from "react";
import RoleSelector from "@/components/RoleSelector";
import OwnerDashboard from "@/components/OwnerDashboard";
import AdminDashboard from "@/components/AdminDashboard";
import BankDashboard from "@/components/BankDashboard";
import CustomerView from "@/components/CustomerView";

const Index = () => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
  };

  const handleBack = () => {
    setSelectedRole(null);
  };

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
