
import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import VideosContent from "@/components/VideosContent";
import { UserRole } from "@/types/test";

const Videos = () => {
  // In a real application, this would come from an authentication context
  const [userRole] = useState<UserRole>("ADMIN");

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <VideosContent userRole={userRole} />
      </div>
    </SidebarProvider>
  );
};

export default Videos;
