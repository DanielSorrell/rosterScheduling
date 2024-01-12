export interface Shift {
  error: boolean;
  id: string;
  position: string;
  startTime: string;
  endTime: string;
  minutes: number;
  instances: number;
  breaks: { startTime: string, endTime: string}[];
  everyday: boolean;
  mon: boolean;
  tue: boolean;
  wed: boolean;
  thu: boolean;
  fri: boolean;
  sat: boolean;
  sun: boolean;
}
