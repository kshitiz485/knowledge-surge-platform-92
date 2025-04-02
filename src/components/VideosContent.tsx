
import { useState } from "react";
import { SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { UserCircle2, Plus, Search, ShieldAlert, Play, Calendar } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { UserRole, VideoResource } from "@/types/test";

// Sample data
const initialVideos: VideoResource[] = [
  {
    id: "1",
    title: "JEE Physics: Understanding Kinematics",
    description: "A comprehensive explanation of kinematics concepts for JEE preparation.",
    youtubeId: "dQw4w9WgXcQ",
    subject: "Physics",
    uploadedBy: "LAKSHYA",
    date: "2025/01/15"
  },
  {
    id: "2",
    title: "Chemistry: P-Block Elements",
    description: "Detailed lecture on P-Block elements for competitive exams.",
    youtubeId: "dQw4w9WgXcQ",
    subject: "Chemistry",
    uploadedBy: "LAKSHYA",
    date: "2025/01/10"
  },
  {
    id: "3",
    title: "Mathematics: Integral Calculus for JEE",
    description: "Master integral calculus for JEE Main and Advanced.",
    youtubeId: "dQw4w9WgXcQ",
    subject: "Mathematics",
    uploadedBy: "LAKSHYA",
    date: "2025/01/05"
  }
];

interface VideosContentProps {
  userRole: UserRole;
}

const VideosContent = ({ userRole }: VideosContentProps) => {
  const [videos, setVideos] = useState<VideoResource[]>(initialVideos);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<VideoResource | null>(null);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  
  const isAdmin = userRole === "ADMIN";
  const form = useForm<VideoResource>({
    defaultValues: {
      title: "",
      description: "",
      youtubeId: "",
      subject: "Physics",
      uploadedBy: "LAKSHYA",
      date: new Date().toISOString().split('T')[0].replace(/-/g, '/')
    }
  });

  const handleAddVideo = () => {
    if (!isAdmin) {
      toast.error("Only administrators can add videos");
      return;
    }
    form.reset({
      title: "",
      description: "",
      youtubeId: "",
      subject: "Physics",
      uploadedBy: "LAKSHYA",
      date: new Date().toISOString().split('T')[0].replace(/-/g, '/')
    });
    setCurrentVideo(null);
    setIsDialogOpen(true);
  };

  const handleSaveVideo = (values: VideoResource) => {
    if (!isAdmin) {
      toast.error("Only administrators can save videos");
      return;
    }
    
    if (currentVideo) {
      // Edit existing video
      setVideos(videos.map(vid => 
        vid.id === currentVideo.id ? { ...values, id: currentVideo.id } : vid
      ));
      toast.success("Video updated successfully");
    } else {
      // Add new video
      const newVideo = {
        ...values,
        id: (videos.length + 1).toString() // Simple ID generation
      };
      setVideos([newVideo, ...videos]);
      toast.success("New video added successfully");
    }
    setIsDialogOpen(false);
  };

  const handleEditVideo = (video: VideoResource) => {
    if (!isAdmin) {
      toast.error("Only administrators can edit videos");
      return;
    }
    setCurrentVideo(video);
    form.reset(video);
    setIsDialogOpen(true);
  };

  const handleDeleteVideo = (id: string) => {
    if (!isAdmin) {
      toast.error("Only administrators can delete videos");
      return;
    }
    setVideos(videos.filter(vid => vid.id !== id));
    toast.success("Video deleted successfully");
  };

  const handlePlayVideo = (id: string) => {
    setActiveVideoId(id === activeVideoId ? null : id);
  };

  const filteredVideos = videos.filter(vid => 
    vid.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vid.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vid.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SidebarInset className="bg-light">
      <header className="sticky top-0 z-90 bg-white shadow-sm py-5 px-8 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="text-primary" />
          <h1 className="text-2xl font-playfair text-primary">Video Resources</h1>
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
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          {isAdmin ? (
            <Button onClick={handleAddVideo} className="bg-gold hover:bg-gold/90 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Video
            </Button>
          ) : (
            <div className="text-sm text-gray-500 italic">
              View-only mode. Contact an administrator for changes.
            </div>
          )}
        </div>
        
        <div className="space-y-6">
          {filteredVideos.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No videos found. Add a new video to get started.
            </div>
          ) : (
            filteredVideos.map((video) => (
              <div key={video.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold mb-2 flex items-center">
                        {video.title}
                      </h2>
                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{video.date}</span>
                        <span className="mx-2">•</span>
                        <span>{video.subject}</span>
                        <span className="mx-2">•</span>
                        <span>{video.uploadedBy}</span>
                      </div>
                      <p className="text-gray-700 mb-4">{video.description}</p>
                    </div>
                    {isAdmin && (
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditVideo(video)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
                          onClick={() => handleDeleteVideo(video.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <Button 
                      onClick={() => handlePlayVideo(video.id)} 
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      {activeVideoId === video.id ? "Hide Video" : "Watch Video"}
                    </Button>
                  </div>
                </div>
                
                {activeVideoId === video.id && (
                  <div className="aspect-w-16 aspect-h-9 relative">
                    <iframe 
                      src={`https://www.youtube.com/embed/${video.youtubeId}`} 
                      className="w-full h-80 border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen>
                    </iframe>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{currentVideo ? "Edit Video" : "Add New Video"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(handleSaveVideo)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Video title" {...field} required />
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
                        placeholder="Video description" 
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
                name="youtubeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>YouTube Video ID</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. dQw4w9WgXcQ (part after v= in YouTube URL)" 
                        {...field} 
                        required 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
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
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary">
                  {currentVideo ? "Update" : "Add"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </SidebarInset>
  );
};

export default VideosContent;
