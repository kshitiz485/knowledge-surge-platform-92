import { useState } from "react";
import { SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { UserCircle2, Plus, Search, ShieldAlert, Home } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { TestSchedule, UserRole } from "@/types/test";
import TestScheduleTable from "./TestScheduleTable";
import TestScheduleDialog from "./TestScheduleDialog";
import TestQuestionForm, { Question } from "./TestQuestionForm";
import MockTestPreview from "./MockTestPreview";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

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
  const { user } = useAuth();
  
  const userRole: UserRole = (user && user.app_metadata && user.app_metadata.role) || "USER";
  
  const [testSchedules, setTestSchedules] = useState<TestSchedule[]>(initialTestSchedules);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isQuestionFormOpen, setIsQuestionFormOpen] = useState(false);
  const [isMockTestPreviewOpen, setIsMockTestPreviewOpen] = useState(false);
  const [currentTest, setCurrentTest] = useState<TestSchedule | null>(null);
  const [currentTestQuestions, setCurrentTestQuestions] = useState<Question[]>([]);

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
      setTestSchedules(testSchedules.map(t => 
        t.id === test.id ? test : t
      ));
      toast.success("Test updated successfully");
      setIsDialogOpen(false);
    } else {
      const newTest = {
        ...test,
        id: (testSchedules.length + 1).toString()
      };
      setTestSchedules([...testSchedules, newTest]);
      toast.success("New test created successfully");
      setIsDialogOpen(false);
      
      setCurrentTest(newTest);
      setIsQuestionFormOpen(true);
    }
  };

  const handleDeleteTest = (id: string) => {
    setTestSchedules(testSchedules.filter(test => test.id !== id));
    toast.success("Test deleted successfully");
  };

  const handleAddQuestions = (test: TestSchedule) => {
    setCurrentTest(test);
    setIsQuestionFormOpen(true);
  };

  const handlePreviewMockTest = (questions: Question[]) => {
    setCurrentTestQuestions(questions);
    setIsQuestionFormOpen(false);
    setIsMockTestPreviewOpen(true);
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
          <div className="flex items-center gap-2 bg-amber-100 text-amber-600 px-3 py-1 rounded-full ml-3">
            <ShieldAlert className="h-4 w-4" />
            <span className="text-xs font-semibold">Admin Only</span>
          </div>
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
          userRole={userRole}
          onAddQuestions={handleAddQuestions}
        />
        
        <TestScheduleDialog 
          isOpen={isDialogOpen} 
          onClose={() => setIsDialogOpen(false)} 
          onSave={handleSaveTest} 
          test={currentTest} 
        />

        {currentTest && (
          <>
            <TestQuestionForm
              isOpen={isQuestionFormOpen}
              onClose={() => setIsQuestionFormOpen(false)}
              onPreview={handlePreviewMockTest}
              testTitle={currentTest.title}
            />

            <MockTestPreview
              isOpen={isMockTestPreviewOpen}
              onClose={() => setIsMockTestPreviewOpen(false)}
              questions={currentTestQuestions}
              testTitle={currentTest.title}
            />
          </>
        )}
      </main>
    </SidebarInset>
  );
};

export default TestManagementContent;
