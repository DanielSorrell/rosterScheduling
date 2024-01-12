export interface FulfilledShift {
  id: string;
  date: Date;
  day: string;
  position: string;
  minutes: number;
  scheduledEmployeeID: string;
  startTime: string;
  endTime: string;
  breaks: {startTime: string, endTime: string}[];
}
