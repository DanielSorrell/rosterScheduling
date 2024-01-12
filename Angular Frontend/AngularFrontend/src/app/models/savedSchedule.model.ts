import { ScheduledEmployee } from './scheduledEmployee.model';
import { ScheduledShift } from './scheduleShift.model';

export interface SavedSchedule {
  start: Date;
  end: Date;
  name: string;
  filterColors: {position: string, color: string}[];
  fulfilledShifts: {day: string, shifts: ScheduledShift[]}[];
  unfulfilledShifts: {day: string, shifts: ScheduledShift[]}[];
  scheduledEmployees: ScheduledEmployee[];
  notes: string;
}
