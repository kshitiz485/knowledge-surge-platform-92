
export interface TestSchedule {
  id: string;
  title: string;
  instructor: string;
  date: string;
  time: string;
  duration: string;
  status: "ONLINE" | "OFFLINE";
  participants?: string[];
}
