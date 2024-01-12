import { Component } from '@angular/core';
import { ScheduledShift } from 'src/app/models/scheduleShift.model';
import sampleWeekA from './sampleWeekA.json';
import sampleWeekB from './sampleWeekB.json';
import { ScheduleService } from 'src/app/services/schedule.service';
import { Router } from '@angular/router';
import { UnfilledShift } from 'src/app/models/unfilledShift.model';

@Component({
  selector: 'app-schedule-list',
  templateUrl: './schedule-list.component.html',
  styleUrls: ['./schedule-list.component.css']
})
export class ScheduleListComponent {
  constructor(private router: Router, private scheduleService: ScheduleService) {}

  exampleDates: {start: Date, end: Date}[] = [];

  ngOnInit(): void {
    //Generate monthly schedules till 5 months after current month
    this.exampleDates = [];
    for(let i = 1; i < 6; i++){
      let exampleDate = new Date();

      let currentMonth = exampleDate.getMonth();
      let currentYear = exampleDate.getFullYear();
      let nextMonth = currentMonth + i;
      let nextYear = currentYear;

      if(nextMonth > 11){
        nextMonth -= 12;
        nextYear += 1;
      }

      const nextMonthDate = new Date(nextYear, nextMonth, 1);
      const firstDay = new Date(nextYear, nextMonth, 1);
      const lastDay = new Date(nextYear, nextMonth + 1, 0);
      this.exampleDates.push({start: firstDay, end: lastDay});
    }
  }

  uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
    .replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  fillSampleSchedule(start: Date, end: Date) {
    let day: {
      date: Date,
      day: string,
      shifts: {
        day: Date,
        position: string,
        minutes: number,
        scheduledEmployeeID: string,
        startTime: string,
        endTime: string,
        breaks: {startTime: string, endTime: string}[],
        instance: number
      }[]
    };
    let schedule: {
      shiftDate: Date,
      shift: ScheduledShift,
      employee: string
    }[] = [];

    let altWeek = false;
    let loop = start;
    while(loop <= end){
      const currentDay = loop.toDateString().substring(0, 3);
      let sample;
      if(altWeek){
        sample = sampleWeekB.scheduledShifts;
      } else {
        sample = sampleWeekA.scheduledShifts;
      }

      for(const day of sample){
        if(day.day == currentDay){
          for(const shift of day.shifts){
            const newID = this.uuidv4();
            let newShiftUnfilled: ScheduledShift = {
              id: newID,
              date: loop,
              day: currentDay,
              position: shift.position,
              scheduledEmployeeID: shift.scheduledEmployeeID,
              startTime: shift.startTime,
              endTime: shift.endTime,
              minutes: shift.minutes,
              breaks: shift.breaks
            };

            schedule.push({
              shiftDate: loop,
              shift: newShiftUnfilled,
              employee: shift.scheduledEmployeeID
            });
          }
        }
      }

      const loopTemp = new Date(loop);
      let newDate = loopTemp.setDate(loopTemp.getDate() + 1);
      loop = new Date(newDate);
      if(currentDay == 'Sun'){
        if(!altWeek){
          altWeek = true;
        } else {
          altWeek = false;
        }
      }
    }

    this.scheduleService.openSampleSchedule(start.toLocaleDateString('default', {month: 'long'}), start, end, schedule);
    this.router.navigate(['schedule/edit']);
  }
}
