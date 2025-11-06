import { useState } from "react";
import DashboardLayout from "./DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Users, FileCheck, ShieldCheck, UserCheck } from "lucide-react";
import BanksTab from "./admin/BanksTab";
import CustomersTab from "./admin/CustomersTab";
import RequestsTab from "./admin/RequestsTab";
import AuthorizationsTab from "./admin/AuthorizationsTab";
import PendingKYCTab from "./admin/PendingKYCTab";

interface AdminDashboardProps {
  onBack: () => void;
}

const AdminDashboard = ({ onBack }: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState("pending");

  return (
    <DashboardLayout
      title="Admin Dashboard"
      subtitle="Manage banks, customers, and KYC operations"
      onBack={onBack}
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 h-auto p-1">
          <TabsTrigger value="pending" className="flex items-center gap-2 py-3">
            <UserCheck className="h-4 w-4" />
            <span className="hidden sm:inline">Pending KYC</span>
          </TabsTrigger>
          <TabsTrigger value="banks" className="flex items-center gap-2 py-3">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">Banks</span>
          </TabsTrigger>
          <TabsTrigger value="customers" className="flex items-center gap-2 py-3">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Customers</span>
          </TabsTrigger>
          <TabsTrigger value="requests" className="flex items-center gap-2 py-3">
            <FileCheck className="h-4 w-4" />
            <span className="hidden sm:inline">Requests</span>
          </TabsTrigger>
          <TabsTrigger value="authorizations" className="flex items-center gap-2 py-3">
            <ShieldCheck className="h-4 w-4" />
            <span className="hidden sm:inline">Access</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <PendingKYCTab />
        </TabsContent>

        <TabsContent value="banks" className="space-y-4">
          <BanksTab />
        </TabsContent>

        <TabsContent value="customers" className="space-y-4">
          <CustomersTab />
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          <RequestsTab />
        </TabsContent>

        <TabsContent value="authorizations" className="space-y-4">
          <AuthorizationsTab />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default AdminDashboard;
