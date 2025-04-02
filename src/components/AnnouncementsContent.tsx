
import { useState } from "react";
import { SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { UserCircle2, Plus, Search, ShieldAlert, Megaphone, Calendar } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { Checkbox } from "./ui/checkbox";
import { Textarea } from "./ui/textarea";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { UserRole, Announcement } from "@/types/test";

// Sample data
const initialAnnouncements: Announcement[] = [
  {
    id: "1",
    title: "JEE Main Test Series Update",
    content: "We've updated the JEE Main Test Series with new questions. Please check the test schedule for upcoming tests.",
    date: "2025/01/15",
    author: "LAKSHYA",
    important: true
  },
  {
    id: "2",
    title: "Holiday Schedule for Republic Day",
    content: "Please note that all classes will be suspended on January 26th for Republic Day. Normal schedule resumes on January 27th.",
    date: "2025/01/10",
    author: "LAKSHYA",
    important: false
  },
  {
    id: "3",
    title: "Study Material Update: P-Block Elements",
    content: "New study materials for P-Block Elements have been uploaded. You can access them from the Study Material section.",
    date: "2025/01/05",
    author: "LAKSHYA",
    important: false
  }
];

interface AnnouncementsContentProps {
  userRole: UserRole;
}

const AnnouncementsContent = ({ userRole }: AnnouncementsContentProps) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentAnnouncement, setCurrentAnnouncement] = useState<Announcement | null>(null);
  
  const isAdmin = userRole === "ADMIN";
  const form = useForm<Announcement>({
    defaultValues: {
      title: "",
      content: "",
      date: new Date().toISOString().split('T')[0].replace(/-/g, '/'),
      author: "LAKSHYA",
      important: false
    }
  });

  const handleAddAnnouncement = () => {
    if (!isAdmin) {
      toast.error("Only administrators can add announcements");
      return;
    }
    form.reset({
      title: "",
      content: "",
      date: new Date().toISOString().split('T')[0].replace(/-/g, '/'),
      author: "LAKSHYA",
      important: false
    });
    setCurrentAnnouncement(null);
    setIsDialogOpen(true);
  };

  const handleSaveAnnouncement = (values: Announcement) => {
    if (!isAdmin) {
      toast.error("Only administrators can save announcements");
      return;
    }
    
    if (currentAnnouncement) {
      // Edit existing announcement
      setAnnouncements(announcements.map(ann => 
        ann.id === currentAnnouncement.id ? { ...values, id: currentAnnouncement.id } : ann
      ));
      toast.success("Announcement updated successfully");
    } else {
      // Add new announcement
      const newAnnouncement = {
        ...values,
        id: (announcements.length + 1).toString() // Simple ID generation
      };
      setAnnouncements([newAnnouncement, ...announcements]);
      toast.success("New announcement created successfully");
    }
    setIsDialogOpen(false);
  };

  const handleEditAnnouncement = (announcement: Announcement) => {
    if (!isAdmin) {
      toast.error("Only administrators can edit announcements");
      return;
    }
    setCurrentAnnouncement(announcement);
    form.reset(announcement);
    setIsDialogOpen(true);
  };

  const handleDeleteAnnouncement = (id: string) => {
    if (!isAdmin) {
      toast.error("Only administrators can delete announcements");
      return;
    }
    setAnnouncements(announcements.filter(ann => ann.id !== id));
    toast.success("Announcement deleted successfully");
  };

  const filteredAnnouncements = announcements.filter(ann => 
    ann.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ann.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SidebarInset className="bg-light">
      <header className="sticky top-0 z-90 bg-white shadow-sm py-5 px-8 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="text-primary" />
          <h1 className="text-2xl font-playfair text-primary">Announcements</h1>
        </div>
        <div className="flex items-center gap-2">
          {isAdmin && (
            <div className="flex items-center gap-2 bg-amber-100 text-amber-600 px-3 py-1 rounded-full mr-3">
              <ShieldAlert className="h-4 w-4" />
              <span className="text-xs font-semibold">Admin Mode</span>
            </div>
          )}
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
              placeholder="Search announcements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          {isAdmin ? (
            <Button onClick={handleAddAnnouncement} className="bg-gold hover:bg-gold/90 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Announcement
            </Button>
          ) : (
            <div className="text-sm text-gray-500 italic">
              View-only mode. Contact an administrator for changes.
            </div>
          )}
        </div>
        
        <div className="space-y-5">
          {filteredAnnouncements.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No announcements found. Add a new announcement to get started.
            </div>
          ) : (
            filteredAnnouncements.map((announcement) => (
              <div 
                key={announcement.id} 
                className={`bg-white rounded-lg shadow p-6 ${announcement.important ? 'border-l-4 border-red-500' : ''}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold mb-2 flex items-center">
                      {announcement.important && (
                        <Megaphone className="h-5 w-5 text-red-500 mr-2" />
                      )}
                      {announcement.title}
                    </h2>
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{announcement.date}</span>
                      <span className="mx-2">•</span>
                      <span>{announcement.author}</span>
                    </div>
                  </div>
                  {isAdmin && (
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditAnnouncement(announcement)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
                        onClick={() => handleDeleteAnnouncement(announcement.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
                <p className="text-gray-700 whitespace-pre-line">{announcement.content}</p>
              </div>
            ))
          )}
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{currentAnnouncement ? "Edit Announcement" : "Add New Announcement"}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSaveAnnouncement)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Announcement title" {...field} required />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Announcement content" 
                          className="min-h-[120px]" 
                          {...field} 
                          required 
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="important"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange} 
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Mark as Important
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-primary">
                    {currentAnnouncement ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </main>
    </SidebarInset>
  );
};

export default AnnouncementsContent;

