import { ScheduledShift } from './scheduleShift.model';
import { Employee } from './employee.model';

export interface ScheduledEmployee {
  employeeInfo: Employee;
  shifts: ScheduledShift[];
  positions: string[];
  totalMinutes: number;
  totalDays: number;
}
