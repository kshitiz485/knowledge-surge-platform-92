
import {
  CalendarClock,
  Clock,
  Edit,
  Trash,
  UserCircle2,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { cn } from "@/lib/utils";
import { TestSchedule } from "@/types/test";

interface TestScheduleTableProps {
  tests: TestSchedule[];
  onEdit: (test: TestSchedule) => void;
  onDelete: (id: string) => void;
}

const TestScheduleTable = ({ tests, onEdit, onDelete }: TestScheduleTableProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40%]">Test Name</TableHead>
            <TableHead>Instructor</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tests.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                No test schedules found
              </TableCell>
            </TableRow>
          ) : (
            tests.map((test) => (
              <TableRow key={test.id}>
                <TableCell className="font-medium">{test.title}</TableCell>
                <TableCell className="flex items-center gap-1">
                  <UserCircle2 className="h-4 w-4 text-gray-500" />
                  {test.instructor}
                </TableCell>
                <TableCell className="flex items-center gap-1">
                  <CalendarClock className="h-4 w-4 text-gray-500" />
                  {test.date}
                </TableCell>
                <TableCell className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-gray-500" />
                  {test.time}
                </TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-semibold",
                      test.status === "ONLINE"
                        ? "bg-green-100 text-green-600"
                        : "bg-amber-100 text-amber-600"
                    )}
                  >
                    {test.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(test)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-500 border-red-200 hover:bg-red-50"
                      onClick={() => onDelete(test.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TestScheduleTable;
