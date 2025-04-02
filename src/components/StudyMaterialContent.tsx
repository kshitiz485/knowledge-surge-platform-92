
import { useState } from "react";
import { SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { UserCircle2, Plus, Search, ShieldAlert, FileText, Calendar, Download } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { UserRole, StudyMaterial } from "@/types/test";

// Sample data
const initialMaterials: StudyMaterial[] = [
  {
    id: "1",
    title: "JEE Physics: Mechanics Notes",
    description: "Comprehensive notes on mechanics concepts for JEE preparation.",
    fileUrl: "https://example.com/physics_notes.pdf",
    subject: "Physics",
    uploadedBy: "LAKSHYA",
    uploadDate: "2025/01/15",
    fileType: "pdf"
  },
  {
    id: "2",
    title: "Chemistry: P-Block Elements",
    description: "Detailed notes on P-Block elements for competitive exams.",
    fileUrl: "https://example.com/chemistry_notes.pdf",
    subject: "Chemistry",
    uploadedBy: "LAKSHYA",
    uploadDate: "2025/01/10",
    fileType: "pdf"
  },
  {
    id: "3",
    title: "Mathematics: Integral Calculus Formulas",
    description: "Formula sheet for integral calculus for JEE Main and Advanced.",
    fileUrl: "https://example.com/math_formulas.pdf",
    subject: "Mathematics",
    uploadedBy: "LAKSHYA",
    uploadDate: "2025/01/05",
    fileType: "pdf"
  }
];

interface StudyMaterialContentProps {
  userRole: UserRole;
}

const StudyMaterialContent = ({ userRole }: StudyMaterialContentProps) => {
  const [materials, setMaterials] = useState<StudyMaterial[]>(initialMaterials);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentMaterial, setCurrentMaterial] = useState<StudyMaterial | null>(null);
  
  const isAdmin = userRole === "ADMIN";
  const form = useForm<StudyMaterial>({
    defaultValues: {
      title: "",
      description: "",
      fileUrl: "",
      subject: "Physics",
      uploadedBy: "LAKSHYA",
      uploadDate: new Date().toISOString().split('T')[0].replace(/-/g, '/'),
      fileType: "pdf"
    }
  });

  const handleAddMaterial = () => {
    if (!isAdmin) {
      toast.error("Only administrators can add study materials");
      return;
    }
    form.reset({
      title: "",
      description: "",
      fileUrl: "",
      subject: "Physics",
      uploadedBy: "LAKSHYA",
      uploadDate: new Date().toISOString().split('T')[0].replace(/-/g, '/'),
      fileType: "pdf"
    });
    setCurrentMaterial(null);
    setIsDialogOpen(true);
  };

  const handleSaveMaterial = (values: StudyMaterial) => {
    if (!isAdmin) {
      toast.error("Only administrators can save study materials");
      return;
    }
    
    if (currentMaterial) {
      // Edit existing material
      setMaterials(materials.map(mat => 
        mat.id === currentMaterial.id ? { ...values, id: currentMaterial.id } : mat
      ));
      toast.success("Study material updated successfully");
    } else {
      // Add new material
      const newMaterial = {
        ...values,
        id: (materials.length + 1).toString() // Simple ID generation
      };
      setMaterials([newMaterial, ...materials]);
      toast.success("New study material added successfully");
    }
    setIsDialogOpen(false);
  };

  const handleEditMaterial = (material: StudyMaterial) => {
    if (!isAdmin) {
      toast.error("Only administrators can edit study materials");
      return;
    }
    setCurrentMaterial(material);
    form.reset(material);
    setIsDialogOpen(true);
  };

  const handleDeleteMaterial = (id: string) => {
    if (!isAdmin) {
      toast.error("Only administrators can delete study materials");
      return;
    }
    setMaterials(materials.filter(mat => mat.id !== id));
    toast.success("Study material deleted successfully");
  };

  const filteredMaterials = materials.filter(mat => 
    mat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mat.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mat.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getFileTypeIcon = (fileType: string) => {
    switch (fileType) {
      case 'pdf':
        return <FileText className="h-10 w-10 text-red-500" />;
      case 'doc':
        return <FileText className="h-10 w-10 text-blue-500" />;
      case 'ppt':
        return <FileText className="h-10 w-10 text-orange-500" />;
      default:
        return <FileText className="h-10 w-10 text-gray-500" />;
    }
  };

  return (
    <SidebarInset className="bg-light">
      <header className="sticky top-0 z-90 bg-white shadow-sm py-5 px-8 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="text-primary" />
          <h1 className="text-2xl font-playfair text-primary">Study Materials</h1>
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
              placeholder="Search study materials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          {isAdmin ? (
            <Button onClick={handleAddMaterial} className="bg-gold hover:bg-gold/90 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Study Material
            </Button>
          ) : (
            <div className="text-sm text-gray-500 italic">
              View-only mode. Contact an administrator for changes.
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.length === 0 ? (
            <div className="text-center py-8 text-gray-500 col-span-full">
              No study materials found. Add a new study material to get started.
            </div>
          ) : (
            filteredMaterials.map((material) => (
              <div key={material.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex mb-4">
                  {getFileTypeIcon(material.fileType)}
                  <div className="ml-4">
                    <h2 className="text-lg font-semibold">{material.title}</h2>
                    <div className="text-sm text-gray-500">
                      <span>{material.subject}</span>
                      <span className="mx-1">•</span>
                      <span>{material.fileType.toUpperCase()}</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4 text-sm">{material.description}</p>
                
                <div className="text-xs text-gray-500 mb-4 flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>Uploaded on {material.uploadDate} by {material.uploadedBy}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <a 
                    href={material.fileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </a>
                  
                  {isAdmin && (
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditMaterial(material)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
                        onClick={() => handleDeleteMaterial(material.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{currentMaterial ? "Edit Study Material" : "Add New Study Material"}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSaveMaterial)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Study material title" {...field} required />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Study material description" 
                          className="min-h-[80px]" 
                          {...field} 
                          required 
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="fileUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>File URL</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="URL to the file" 
                          {...field} 
                          required 
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a subject" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Physics">Physics</SelectItem>
                            <SelectItem value="Chemistry">Chemistry</SelectItem>
                            <SelectItem value="Mathematics">Mathematics</SelectItem>
                            <SelectItem value="Biology">Biology</SelectItem>
                            <SelectItem value="General">General</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="fileType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>File Type</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select file type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="pdf">PDF</SelectItem>
                            <SelectItem value="doc">DOC</SelectItem>
                            <SelectItem value="ppt">PPT</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-primary">
                    {currentMaterial ? "Update" : "Add"}
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

export default StudyMaterialContent;

