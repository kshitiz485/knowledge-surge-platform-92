
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { format, parse } from "date-fns";
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
import { Calendar } from "./ui/calendar";
import { CalendarIcon, Clock } from "lucide-react";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import { cn } from "@/lib/utils";

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

  // State for date picker
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  
  // Time options
  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = ["00", "15", "30", "45"];
  const [startHour, setStartHour] = useState<string>("02");
  const [startMinute, setStartMinute] = useState<string>("00");
  const [startAmPm, setStartAmPm] = useState<string>("PM");
  const [endHour, setEndHour] = useState<string>("05");
  const [endMinute, setEndMinute] = useState<string>("00");
  const [endAmPm, setEndAmPm] = useState<string>("PM");

  // Parse time from string to components
  const parseTimeString = (timeString: string) => {
    if (!timeString) return;
    
    const parts = timeString.split(" - ");
    if (parts.length !== 2) return;
    
    const startTime = parts[0].trim();
    const endTime = parts[1].trim();
    
    // Parse start time
    const startMatch = startTime.match(/(\d+):(\d+)\s+(AM|PM)/i);
    if (startMatch) {
      setStartHour(startMatch[1].padStart(2, '0'));
      setStartMinute(startMatch[2]);
      setStartAmPm(startMatch[3].toUpperCase());
    }
    
    // Parse end time
    const endMatch = endTime.match(/(\d+):(\d+)\s+(AM|PM)/i);
    if (endMatch) {
      setEndHour(endMatch[1].padStart(2, '0'));
      setEndMinute(endMatch[2]);
      setEndAmPm(endMatch[3].toUpperCase());
    }
  };

  // Format time components to string
  const formatTimeString = () => {
    return `${startHour}:${startMinute} ${startAmPm} - ${endHour}:${endMinute} ${endAmPm}`;
  };

  useEffect(() => {
    if (test) {
      form.reset(test);
      
      // Parse date string to Date object
      if (test.date) {
        try {
          const parsedDate = parse(test.date, "yyyy/MM/dd", new Date());
          setSelectedDate(parsedDate);
        } catch (error) {
          console.error("Error parsing date:", error);
        }
      }
      
      // Parse time string
      if (test.time) {
        parseTimeString(test.time);
      }
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
      setSelectedDate(undefined);
      // Reset time components
      setStartHour("02");
      setStartMinute("00");
      setStartAmPm("PM");
      setEndHour("05");
      setEndMinute("00");
      setEndAmPm("PM");
    }
  }, [test, form]);

  // Update form values when date or time components change
  useEffect(() => {
    if (selectedDate) {
      const formattedDate = format(selectedDate, "yyyy/MM/dd");
      form.setValue("date", formattedDate);
    }
    
    const formattedTime = formatTimeString();
    form.setValue("time", formattedTime);
  }, [selectedDate, startHour, startMinute, startAmPm, endHour, endMinute, endAmPm, form]);

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
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              field.value
                            ) : (
                              <span>Select date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
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
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              field.value
                            ) : (
                              <span>Select time</span>
                            )}
                            <Clock className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-4" align="start">
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium mb-2">Start Time</h4>
                            <div className="flex gap-2">
                              <Select 
                                value={startHour} 
                                onValueChange={setStartHour}
                              >
                                <SelectTrigger className="w-20">
                                  <SelectValue placeholder="Hour" />
                                </SelectTrigger>
                                <SelectContent>
                                  {hours.map((hour) => (
                                    <SelectItem 
                                      key={`start-hour-${hour}`} 
                                      value={hour.toString().padStart(2, '0')}
                                    >
                                      {hour}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Select 
                                value={startMinute} 
                                onValueChange={setStartMinute}
                              >
                                <SelectTrigger className="w-20">
                                  <SelectValue placeholder="Min" />
                                </SelectTrigger>
                                <SelectContent>
                                  {minutes.map((min) => (
                                    <SelectItem key={`start-min-${min}`} value={min}>
                                      {min}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Select 
                                value={startAmPm} 
                                onValueChange={setStartAmPm}
                              >
                                <SelectTrigger className="w-20">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="AM">AM</SelectItem>
                                  <SelectItem value="PM">PM</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-medium mb-2">End Time</h4>
                            <div className="flex gap-2">
                              <Select 
                                value={endHour} 
                                onValueChange={setEndHour}
                              >
                                <SelectTrigger className="w-20">
                                  <SelectValue placeholder="Hour" />
                                </SelectTrigger>
                                <SelectContent>
                                  {hours.map((hour) => (
                                    <SelectItem 
                                      key={`end-hour-${hour}`} 
                                      value={hour.toString().padStart(2, '0')}
                                    >
                                      {hour}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Select 
                                value={endMinute} 
                                onValueChange={setEndMinute}
                              >
                                <SelectTrigger className="w-20">
                                  <SelectValue placeholder="Min" />
                                </SelectTrigger>
                                <SelectContent>
                                  {minutes.map((min) => (
                                    <SelectItem key={`end-min-${min}`} value={min}>
                                      {min}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Select 
                                value={endAmPm} 
                                onValueChange={setEndAmPm}
                              >
                                <SelectTrigger className="w-20">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="AM">AM</SelectItem>
                                  <SelectItem value="PM">PM</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
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
