
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { UserCircle2, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Performance = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset className="bg-light">
          <header className="sticky top-0 z-90 bg-white shadow-sm py-5 px-8 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="text-primary" />
              <h1 className="text-2xl font-playfair text-primary">Performance</h1>
            </div>
            <div className="flex items-center gap-4">
              <Button asChild variant="outline" size="sm" className="flex items-center gap-2">
                <Link to="/" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </Link>
              </Button>
              <div className="flex items-center gap-2 bg-gold/10 px-4 py-2 rounded-full">
                <UserCircle2 className="text-gold h-5 w-5" />
                <span className="text-primary font-semibold text-sm">SG - Sarvagya Gupta</span>
              </div>
            </div>
          </header>
          
          <main className="px-8 py-6">
            <div className="space-y-5">
              <h2 className="text-xl font-medium text-primary">Performance Analytics</h2>
              <p className="text-gray-500">Your test performance data will be displayed here.</p>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Performance;
