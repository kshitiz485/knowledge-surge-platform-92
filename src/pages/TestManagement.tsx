
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import TestManagementContent from "@/components/TestManagementContent";
import { UserRole } from "@/types/test";

const TestManagement = () => {
  // In a real application, this would come from an authentication context
  const [userRole] = useState<UserRole>("ADMIN");

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <TestManagementContent userRole={userRole} />
      </div>
    </SidebarProvider>
  );
};

export default TestManagement;
