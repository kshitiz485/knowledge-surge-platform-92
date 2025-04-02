
import { useState } from "react";
import { SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { UserCircle2, Plus, Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { TestSchedule } from "@/types/test";
import TestScheduleTable from "./TestScheduleTable";
import TestScheduleDialog from "./TestScheduleDialog";

// Sample data
const initialTestSchedules: TestSchedule[] = [
  {
    id: "1",
    title: "JEE Main Test Series - 6 Test Paper (Full Syllabus Test)",
    instructor: "LAKSHYA",
    date: "2025/01/20",
    time: "02:00 PM - 05:00 PM",
    duration: "3 hours",
    status: "ONLINE",
    participants: ["Class 12 - Science"]
  },
  {
    id: "2",
    title: "12th Class Online Test (P Block Elements) Chemistry",
    instructor: "LAKSHYA",
    date: "2025/01/09",
    time: "07:30 PM - 08:30 PM",
    duration: "1 hour",
    status: "ONLINE",
    participants: ["Class 12 - Science"]
  },
  {
    id: "3",
    title: "12th Class Online Test (Thermodynamics) Chemistry",
    instructor: "LAKSHYA",
    date: "2025/01/08",
    time: "07:30 PM - 08:30 PM",
    duration: "1 hour",
    status: "ONLINE",
    participants: ["Class 12 - Science"]
  }
];

const TestManagementContent = () => {
  const [testSchedules, setTestSchedules] = useState<TestSchedule[]>(initialTestSchedules);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentTest, setCurrentTest] = useState<TestSchedule | null>(null);

  const handleAddNewTest = () => {
    setCurrentTest(null);
    setIsDialogOpen(true);
  };

  const handleEditTest = (test: TestSchedule) => {
    setCurrentTest(test);
    setIsDialogOpen(true);
  };

  const handleSaveTest = (test: TestSchedule) => {
    if (currentTest) {
      // Edit existing test
      setTestSchedules(testSchedules.map(t => 
        t.id === test.id ? test : t
      ));
    } else {
      // Add new test
      const newTest = {
        ...test,
        id: (testSchedules.length + 1).toString() // Simple ID generation
      };
      setTestSchedules([...testSchedules, newTest]);
    }
    setIsDialogOpen(false);
  };

  const handleDeleteTest = (id: string) => {
    setTestSchedules(testSchedules.filter(test => test.id !== id));
  };

  const filteredTests = testSchedules.filter(test => 
    test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    test.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
    test.date.includes(searchQuery)
  );

  return (
    <SidebarInset className="bg-light">
      <header className="sticky top-0 z-90 bg-white shadow-sm py-5 px-8 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="text-primary" />
          <h1 className="text-2xl font-playfair text-primary">Test Management</h1>
        </div>
        <div className="flex items-center gap-2 bg-gold/10 px-4 py-2 rounded-full">
          <UserCircle2 className="text-gold h-5 w-5" />
          <span className="text-primary font-semibold text-sm">SG - Sarvagya Gupta</span>
        </div>
      </header>
      
      <main className="px-8 py-6">
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search tests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button onClick={handleAddNewTest} className="bg-gold hover:bg-gold/90 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add New Test
          </Button>
        </div>
        
        <TestScheduleTable 
          tests={filteredTests} 
          onEdit={handleEditTest} 
          onDelete={handleDeleteTest} 
        />
        
        <TestScheduleDialog 
          isOpen={isDialogOpen} 
          onClose={() => setIsDialogOpen(false)} 
          onSave={handleSaveTest} 
          test={currentTest} 
        />
      </main>
    </SidebarInset>
  );
};

export default TestManagementContent;
