
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "./ui/select";
import { TestSchedule } from "@/types/test";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "./ui/form";

interface TestScheduleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (test: TestSchedule) => void;
  test: TestSchedule | null;
}

const TestScheduleDialog = ({
  isOpen,
  onClose,
  onSave,
  test,
}: TestScheduleDialogProps) => {
  const form = useForm<TestSchedule>({
    defaultValues: {
      id: "",
      title: "",
      instructor: "",
      date: "",
      time: "",
      duration: "",
      status: "ONLINE",
      participants: [],
    },
  });

  useEffect(() => {
    if (test) {
      form.reset(test);
    } else {
      form.reset({
        id: "",
        title: "",
        instructor: "LAKSHYA", // Default value
        date: "",
        time: "",
        duration: "",
        status: "ONLINE",
        participants: [],
      });
    }
  }, [test, form]);

  const handleSubmit = (data: TestSchedule) => {
    onSave(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {test ? "Edit Test Schedule" : "Add New Test Schedule"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Test Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter test name" required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="instructor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instructor</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter instructor name" required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="YYYY/MM/DD" 
                        required 
                        pattern="\d{4}/\d{2}/\d{2}"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="HH:MM AM/PM - HH:MM AM/PM" 
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., 3 hours" required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ONLINE">ONLINE</SelectItem>
                        <SelectItem value="OFFLINE">OFFLINE</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="participants"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Participants</FormLabel>
                  <FormControl>
                    <Input 
                      value={field.value?.join(", ") || ""} 
                      onChange={(e) => {
                        field.onChange(e.target.value.split(",").map(item => item.trim()));
                      }}
                      placeholder="Enter participant groups, separated by commas" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-gold hover:bg-gold/90 text-white"
              >
                {test ? "Update Test" : "Create Test"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TestScheduleDialog;
