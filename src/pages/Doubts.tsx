
import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import DoubtsContent from "@/components/DoubtsContent";
import { UserRole } from "@/types/test";

const Doubts = () => {
  // In a real application, this would come from an authentication context
  const [userRole] = useState<UserRole>("ADMIN");

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <DoubtsContent userRole={userRole} />
      </div>
    </SidebarProvider>
  );
};

export default Doubts;
