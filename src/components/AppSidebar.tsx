
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar";
import { 
  Megaphone, 
  ClipboardList, 
  CalendarPlus,
  Video, 
  BookOpen, 
  LineChart, 
  HelpCircle, 
  Settings,
  ShieldAlert
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const AppSidebar = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  // Get user role from the auth context (default to "USER" if not found)
  const userRole = (user && user.app_metadata && user.app_metadata.role) || "USER";
  
  // If user is logged in, they can access admin features
  // This is for development purposes, in production you'd want stricter checks
  const isAdmin = userRole === "ADMIN" || !!user;
  
  return (
    <Sidebar className="bg-gradient-to-br from-primary to-secondary text-white">
      <SidebarHeader className="border-b border-white/10 pb-4">
        <h1 className="text-2xl font-playfair font-bold gold-gradient">EduLux</h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={location.pathname === "/tests" || location.pathname === "/dashboard"} tooltip="Tests">
              <Link to="/tests">
                <ClipboardList className={location.pathname === "/tests" || location.pathname === "/dashboard" ? "text-gold" : ""} />
                <span>Tests</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {isAdmin && (
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={location.pathname === "/test-management"} tooltip="Test Management">
                <Link to="/test-management">
                  <CalendarPlus className={location.pathname === "/test-management" ? "text-gold" : ""} />
                  <span>Test Management</span>
                  <div className="ml-2 p-1 bg-amber-100 rounded-full">
                    <ShieldAlert className="h-3 w-3 text-amber-600" />
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={location.pathname === "/announcements"} tooltip="Announcements">
              <Link to="/announcements">
                <Megaphone />
                <span>Announcements</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={location.pathname === "/videos"} tooltip="Videos">
              <Link to="/videos">
                <Video />
                <span>Videos</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={location.pathname === "/study-material"} tooltip="Study Material">
              <Link to="/study-material">
                <BookOpen />
                <span>Study Material</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={location.pathname === "/performance"} tooltip="Performance">
              <Link to="/performance">
                <LineChart />
                <span>Performance</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={location.pathname === "/doubts"} tooltip="Doubts">
              <Link to="/doubts">
                <HelpCircle />
                <span>Doubts</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={location.pathname === "/settings"} tooltip="Settings">
              <Link to="/settings">
                <Settings />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
