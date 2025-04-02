
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  Megaphone, 
  ClipboardList, 
  Video, 
  BookOpen, 
  LineChart, 
  HelpCircle, 
  Settings 
} from "lucide-react";
import { Link } from "react-router-dom";

const AppSidebar = () => {
  return (
    <Sidebar className="bg-gradient-to-br from-primary to-secondary text-white">
      <SidebarHeader className="border-b border-white/10 pb-4">
        <h1 className="text-2xl font-playfair font-bold gold-gradient">EduLux</h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive tooltip="Overview">
              <Link to="/dashboard">
                <LayoutDashboard className="text-gold" />
                <span>Overview</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Announcements">
              <Link to="/announcements">
                <Megaphone />
                <span>Announcements</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Tests">
              <Link to="/tests">
                <ClipboardList />
                <span>Tests</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Videos">
              <Link to="/videos">
                <Video />
                <span>Videos</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Study Material">
              <Link to="/study-material">
                <BookOpen />
                <span>Study Material</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Performance">
              <Link to="/performance">
                <LineChart />
                <span>Performance</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Doubts">
              <Link to="/doubts">
                <HelpCircle />
                <span>Doubts</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Settings">
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
