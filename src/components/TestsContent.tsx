
import { SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { UserCircle2 } from "lucide-react";
import TestCard from "./TestCard";

const TestsContent = () => {
  return (
    <SidebarInset className="bg-light">
      <header className="sticky top-0 z-90 bg-white shadow-sm py-5 px-8 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="text-primary" />
          <h1 className="text-2xl font-playfair text-primary">Tests</h1>
        </div>
        <div className="flex items-center gap-2 bg-gold/10 px-4 py-2 rounded-full">
          <UserCircle2 className="text-gold h-5 w-5" />
          <span className="text-primary font-semibold text-sm">SG - Sarvagya Gupta</span>
        </div>
      </header>
      
      <main className="px-8 py-6">
        <div className="space-y-5">
          <TestCard 
            title="JEE Main Test Series - 6 Test Paper (Full Syllabus Test) 20/01/2025"
            instructor="LAKSHYA"
            date="2025/01/20"
            time="02:00 PM - 05:00 PM"
            status="ONLINE"
          />
          
          <TestCard 
            title="12th Class Online Test (P Block Elements) 09/01/2025 Chemistry"
            instructor="LAKSHYA"
            date="2025/01/09"
            time="07:30 PM - 08:30 PM"
            status="ONLINE"
          />
          
          <TestCard 
            title="12th Class Online Test (Thermodynamics) 08/01/2025 Chemistry"
            instructor="LAKSHYA"
            date="2025/01/08"
            time="07:30 PM - 08:30 PM"
            status="ONLINE"
          />
        </div>
      </main>
    </SidebarInset>
  );
};

export default TestsContent;
