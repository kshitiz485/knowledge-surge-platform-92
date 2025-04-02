
import { CalendarClock, Clock, UserCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TestCardProps {
  title: string;
  instructor: string;
  date: string;
  time: string;
  status: "ONLINE" | "OFFLINE";
}

const TestCard = ({ title, instructor, date, time, status }: TestCardProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md transition-all hover:translate-y-[-5px] hover:shadow-lg border-l-4 border-gold relative">
      <h3 className="font-playfair text-lg text-primary font-medium mb-2">{title}</h3>
      <div className="flex gap-5 text-text-light text-sm">
        <span className="flex items-center gap-1">
          <UserCircle2 className="h-4 w-4" />
          Created by {instructor}
        </span>
        <span className="flex items-center gap-1">
          <CalendarClock className="h-4 w-4" />
          {date}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          {time}
        </span>
      </div>
      <div 
        className={cn(
          "absolute top-6 right-6 px-3 py-1 rounded-full text-xs font-semibold",
          status === "ONLINE" 
            ? "bg-green-100 text-green-600" 
            : "bg-amber-100 text-amber-600"
        )}
      >
        {status}
      </div>
    </div>
  );
};

export default TestCard;
