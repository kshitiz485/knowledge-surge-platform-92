
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

export type UserRole = "ADMIN" | "USER";

export interface TestOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface TestQuestion {
  id: string;
  text: string;
  options: TestOption[];
  subject: "physics" | "chemistry" | "mathematics";
}
