import { Component } from '@angular/core';
import { Employee } from 'src/app/models/employee.model';
import { Position } from 'src/app/models/position.model';
import { Shift } from 'src/app/models/shift.model';
import { ScheduledEmployee } from 'src/app/models/scheduledEmployee.model';
import { EmployeesService } from '../../../services/employees.service';
import { ScheduleService } from 'src/app/services/schedule.service';
import { FulfillShiftDialogComponent } from './fulfill-shift-dialog/fulfill-shift-dialog.component';
import { EditShiftDialogComponent } from './edit-shift-dialog/edit-shift-dialog.component';
import { NotesDialogComponent } from './notes-dialog/notes-dialog.component';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialog, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { ScheduledShift } from 'src/app/models/scheduleShift.model';
import { SavedSchedule } from 'src/app/models/savedSchedule.model';

@Component({
  selector: 'app-create-schedule',
  templateUrl: './create-schedule.component.html',
  styleUrls: ['./create-schedule.component.css']
})
export class CreateScheduleComponent {

  defaultPositionFilterColors = [
    '#00FFFF',
    '#800080',
    '#FF6666',
    '#00FF00',
    '#FFA500',
    '#000080',
    '#FF29FF',
    '#005C5C',
    '#800000',
    '#2AAC2A',
    '#0000FF',
    '#FFFF00',
    '#ffd700',
    '#9E9E00',
    '#6E00F5'
  ];

  nonDefaultTextColorsArray = [
    '#800080',
    '#000080',
    '#005C5C',
    '#800000',
    '#0000FF',
    '#6E00F5'
  ];

  isLoading: boolean = true;
  unsavedChanges: boolean = false;
  nonDefaultTextColors: Set<string> = new Set();
  error: boolean = false;
  errorMessage: string = '';

  employees: Map<string, Employee> = new Map();
  employeePositions: Map<string, Set<string>> = new Map();
  scheduleRange: {start: Date, end: Date} = {start: new Date(0), end: new Date(0)};
  filledScheduleRange: {date: Date, day: string, shifts: any}[] = [];

  entireSchedulePayout: number = 0;
  entireScheduleHours: number = 0;
  currentScheduleWeekStartIndex: number = 0;
  currentScheduleWeekEndIndex: number = 0;
  currentScheduleTotalHours: number = 0;
  currentScheduleTotalPayout: number = 0;
  currentScheduleWeek: {date: Date, day: string, shifts: any}[] = [];
  currentScheduleWeekIsEmpty: boolean = true;
  currentWeekScheduledEmployees: string[] = [];

  allPositions: Map<string, Position> = new Map();
  positionFilterColors: Map<string, string> = new Map();
  availablePositionFilterColors: Set<string> = new Set();

  unfulfilledShiftsMap: Map<string, ScheduledShift[]> = new Map();
  fulfilledShiftsMap: Map<string, ScheduledShift[]> = new Map();
  scheduledEmployeesMap: Map<string, ScheduledEmployee> = new Map();
  employeeFilteredList: Map<string, string[]> = new Map();
  positionList: Set<string> = new Set();

  selectedFilter = '';
  selectedFilterDays = new FormControl([]);
  positionFilters: FormGroup;

  savedSchedules: SavedSchedule[] = [];
  scheduleName: string = '';
  scheduleNotes: string = '';
  previousWeekView: boolean = false;
  nextWeekView: boolean = false;
  showEmployeeView = false;
  currentEmployee: ScheduledEmployee = {
    employeeInfo: {
      id: '',
      positions: [],
      preferredName: '',
      firstName: '',
      lastName: '',
      address: '',
      numOfAvailDaysAWeek: 0,
      everydayAvailability: false,
      mondayAvailability: false,
      tuesdayAvailability: false,
      wednesdayAvailability: false,
      thursdayAvailability: false,
      fridayAvailability: false,
      saturdayAvailability: false,
      sundayAvailability: false,
    },
    positions: [],
    shifts: [],
    totalMinutes: 0,
    totalPayout: 0
  };

  constructor(private employeesService: EmployeesService, private scheduleService: ScheduleService, public dialog: MatDialog, private _formBuilder: FormBuilder) {
    this.positionFilters = this._formBuilder.group({
    });
  }

  ngOnInit(): void {
    this.employeesService.getAllPositions()
      .subscribe({
        next: (positions) => {
          for (const position of positions) {
            this.allPositions.set(position.title, position);
          }
        },
        error: (error) => {
          this.error = true;
          this.errorMessage = 'Error retrieving positions from the database';
          this.isLoading = false;
        }
      });

    this.employeesService.getAllEmployees()
      .subscribe({
        next: (employeeList) => {
          for (let employee of employeeList) {
            this.employees.set(employee.id, employee);
            this.employeePositions.set(employee.id, new Set());
            this.employeesService.getEmployeePositions(employee.id)
              .subscribe({
                next: (positions) => {
                  for(let position of positions){
                    this.employeePositions.get(employee.id)!.add(position.title);
                  }
                },
                error: (error) => {
                  this.error = true;
                  this.errorMessage = 'Error retrieving positions from the database';
                  this.isLoading = false;
                }
              });
          }
          if (this.scheduleService.getSampleOpen() == true) {
            this.openSampleSchedule();
          } else if (this.scheduleService.getSavedOpen() == true) {
            this.openSavedSchedule();
          } else {
            this.openFromWizard();
          }
        },
        error: (error) => {
          this.error = true;
          this.errorMessage = 'Error retrieving employees from the database';
          this.isLoading = false;
        }
      });

    for (const color of this.defaultPositionFilterColors) {
      this.availablePositionFilterColors.add(color);
    }

    for (const color of this.nonDefaultTextColorsArray) {
      this.nonDefaultTextColors.add(color);
    }
  }

  ngOnDestroy(): void {
    this.scheduleService.reset();
  }

  /**
   * Opens sample schedule selected from the saved schedule page.
   */
  openSampleSchedule() {
    let range = this.scheduleService.getScheduleRange();
    this.scheduleRange = {
      start: range.start,
      end: range.end
    }

    //Set fulfilled shifts
    this.savedSchedules = this.scheduleService.getSavedSchedules();
    for (let i = 0; i < this.scheduleService.getFulfilledSampleShifts().length; i++) {
      this.fulfillShift(this.scheduleService.getFulfilledSampleShifts()[i].shiftDate, this.scheduleService.getFulfilledSampleShifts()[i].shift, this.scheduleService.getFulfilledSampleShifts()[i].employee);
    }

    //Get and display unique colors for each position
    this.scheduleName = this.scheduleService.getCurrentScheduleName();
    let defaultColorIndex = 0;
    for (let shift of this.scheduleService.getFulfilledSampleShifts()) {
      if (!this.positionList.has(shift.shift.position)) {
        this.positionFilterColors.set(shift.shift.position, this.defaultPositionFilterColors[defaultColorIndex]);
        this.availablePositionFilterColors.delete(this.defaultPositionFilterColors[defaultColorIndex]);
        this.positionList.add(shift.shift.position);
        this.positionFilters.addControl(shift.shift.position, new FormControl(false, []));
        defaultColorIndex++;
      }
    }

    //Fill schedule and set current week to first week of the schedule
    let loop = this.scheduleRange.start;
    while (loop <= this.scheduleRange.end) {
      let currentDayShifts = [];
      const day = loop.toDateString().substring(0, 3).toLocaleLowerCase();
      let shifts: any = this.scheduleService.getFulfilledSampleShifts();

      //If current shift is the same day as the loop day, grab shift
      for (let shift of shifts) {
        if (shift[day]) {
          for (let i = 1; i <= shift.instances; i++) {
            currentDayShifts.push({
              id: '',
              date: loop,
              day: day,
              position: shift.position,
              minutes: shift.minutes,
              scheduledEmployeeID: '',
              startTime: shift.startTime,
              endTime: shift.endTime,
              breaks: shift.breaks,
              instance: i
            });
          }
        }
      }

      let newDay = {
        date: loop,
        day: loop.toDateString().substring(0, 10),
        shifts: currentDayShifts
      };

      this.filledScheduleRange.push(newDay);

      const loopTemp = new Date(loop);
      let newDate = loopTemp.setDate(loopTemp.getDate() + 1);
      loop = new Date(newDate);
    }

    //If schedule is less than or equal to 7 days, hide next week navigation arrow.
    //Else show next week navigational arrow
    if (this.filledScheduleRange.length <= 7) {
      this.currentScheduleWeekEndIndex = this.filledScheduleRange.length - 1;
      this.nextWeekView = false;
    } else {
      this.currentScheduleWeekEndIndex = 6;
      this.nextWeekView = true;
    }

    this.currentScheduleWeek = this.filledScheduleRange.slice(this.currentScheduleWeekStartIndex, this.currentScheduleWeekEndIndex + 1);
    this.setCurrentWeekScheduledEmployees(this.currentScheduleWeekStartIndex, this.currentScheduleWeekEndIndex);
    this.getCurrentWeekSummary(this.currentScheduleWeekStartIndex, this.currentScheduleWeekEndIndex);
    this.getEntireScheduleSummary();
    this.isLoading = false;
  }

  /**
   * Opens created or updated sample schedule selected from the saved schedule page.
   */
  openSavedSchedule() {
    let range = this.scheduleService.getScheduleRange();
    this.scheduleRange = {
      start: range.start,
      end: range.end
    };

    //Get and display unique colors for each position
    for(let position of this.scheduleService.getFilterColors()){
      this.positionFilterColors.set(position.position, position.color);
      this.positionList.add(position.position);
      this.positionFilters.addControl(position.position, new FormControl(false, []));
    }

    //Fill scheduled employees map
    for(let employee of this.scheduleService.getScheduledEmployees()){
      this.scheduledEmployeesMap.set(employee.employeeInfo.id, employee);
    }

    //Set schedule name
    let schedules = this.scheduleService.getSavedSchedules();
    let name = this.scheduleService.getCurrentScheduleName();
    this.scheduleName = name;
    this.scheduleNotes = this.scheduleService.getScheduleNotes();
    schedules = schedules.filter((schedule) => {
      return name !== schedule.name
    });

    //Set fulfilled shifts from schedule
    for (let day of this.scheduleService.getFulfilledSavedShifts()) {
      this.fulfilledShiftsMap.set(day.day, day.shifts);
    }

    //Set unfulfilled shifts from schedule
    for (let day of this.scheduleService.getUnfulfilledSavedShifts()) {
      this.unfulfilledShiftsMap.set(day.day, day.shifts);
      this.filledScheduleRange.push({
        date: new Date(day.day),
        day: day.day.substring(0, 10),
        shifts: day.shifts
      });
    }

    //If schedule is less than or equal to 7 days, hide next week navigation arrow.
    //Else show next week navigational arrow.
    if(this.filledScheduleRange.length <= 7) {
      this.currentScheduleWeekEndIndex = this.filledScheduleRange.length - 1;
      this.nextWeekView = false;
    } else {
      this.currentScheduleWeekEndIndex = 6;
      this.nextWeekView = true;
    }
    this.currentScheduleWeek = this.filledScheduleRange.slice(this.currentScheduleWeekStartIndex, this.currentScheduleWeekEndIndex + 1);

    this.setCurrentWeekScheduledEmployees(this.currentScheduleWeekStartIndex, this.currentScheduleWeekEndIndex);
    this.getCurrentWeekSummary(this.currentScheduleWeekStartIndex, this.currentScheduleWeekEndIndex);
    this.getEntireScheduleSummary();
    this.isLoading = false;
  }

  /**
   * Opens newly created schedule from the scheduler creator page.
   */
  openFromWizard() {
    let range = this.scheduleService.getScheduleRange();
    this.scheduleRange = {
      start: range.start,
      end: range.end
    }
    this.savedSchedules = this.scheduleService.getSavedSchedules();

    //Get and display unique colors for each position
    let defaultColorIndex = 0;
    let unfulfilledShifts: any = this.scheduleService.getUnfulfilledCreatedShifts();
    for (let shift of unfulfilledShifts) {
      if (!this.positionList.has(shift.position)) {
        this.positionFilterColors.set(shift.position, this.defaultPositionFilterColors[defaultColorIndex]);
        this.availablePositionFilterColors.delete(this.defaultPositionFilterColors[defaultColorIndex]);
        this.positionList.add(shift.position);
        this.positionFilters.addControl(shift.position, new FormControl(false, []));
        defaultColorIndex++;
      }
    }

    //Fill schedule, set unfilled shifts, and set current week to first week of the schedule
    let loop = this.scheduleRange.start;
    while (loop <= this.scheduleRange.end) {
      let currentDayShifts = [];
      const day = loop.toDateString().substring(0, 3).toLocaleLowerCase();
      //If current shift is the same day as the loop day, grab shift
      for (let shift of unfulfilledShifts) {
        if (shift[day] || shift.everyday) {
          for (let i = 1; i <= shift.instances; i++) {
            currentDayShifts.push({
              id: '',
              date: loop,
              day: day,
              position: shift.position,
              minutes: shift.minutes,
              scheduledEmployeeID: '',
              startTime: shift.startTime,
              endTime: shift.endTime,
              breaks: shift.breaks,
              instance: i
            });
          }
        }
      }

      let newDay = {
        date: loop,
        day: loop.toDateString().substring(0, 10),
        shifts: currentDayShifts
      };

      this.unfulfilledShiftsMap.set(newDay.date.toDateString(), currentDayShifts);
      this.filledScheduleRange.push(newDay);

      const loopTemp = new Date(loop);
      let newDate = loopTemp.setDate(loopTemp.getDate() + 1);
      loop = new Date(newDate);
    }

    //If schedule is less than or equal to 7 days, hide next week navigation arrow,
    //Else show next week navigational arrow.
    if (this.filledScheduleRange.length <= 7) {
      this.currentScheduleWeekEndIndex = this.filledScheduleRange.length - 1;
      this.nextWeekView = false;
    } else {
      this.currentScheduleWeekEndIndex = 6;
      this.nextWeekView = true;
    }
    this.currentScheduleWeek = this.filledScheduleRange.slice(this.currentScheduleWeekStartIndex, this.currentScheduleWeekEndIndex + 1);

    this.isLoading = false;
  }

  /**
   * Takes a time formatted as 00:00, converts to AM or PM, and returns it.
   * @param time - time to format as AM or PM
   * @returns a string of the converted time
   */
  getTimeDisplay(time: string){
    let conversion: string = time;
    //If minutes are zero, only display the hour
    if(parseInt(time.substring(3, 5)) === 0){
      conversion = time.substring(0, 2);
    }

    if(parseInt(time.substring(0, 2)) === 0){
      let hourFormatted: string = '12';
      conversion = hourFormatted + conversion.substring(2, 5);
      conversion += ' AM';
    } else if(parseInt(time.substring(0, 2)) === 12){
      let hourFormatted: string = '12';
      conversion = hourFormatted + conversion.substring(2, 5);
      conversion += ' PM';
    } else if(parseInt(time.substring(0, 2)) > 11){
      let hourFormatted: string = (parseInt(time.substring(0,2)) - 12).toString();
      conversion = hourFormatted + conversion.substring(2, 5);
      conversion += ' PM';
    } else {
      if(parseInt(time.substring(0, 2)) < 10){
        conversion = conversion.substring(1, conversion.length + 1) + ' AM';
      } else {
        conversion += ' AM';
      }
    }
    return conversion;
  }

  /**
   * Calculates and returns the payout and amount of hours from fulfilled shifts for a day.
   * @param shifts - Array of all the fulfilled shifts for the day
   * @returns an object with the total hours and total payout for the day
   */
  calculateDaySummary(shifts: ScheduledShift[]){
    let totalHours = 0;
    let totalPayout = 0;
    for(let shift of shifts){
      totalHours += shift.minutes;
      totalPayout += shift.minutes * (this.allPositions.get(shift.position)?.rate! / 60);
    }
    return {hours: totalHours, payout: totalPayout};
  }

  /**
   * Calculates and sets the hours and payout for the current week.
   * @param start - index for the first day of the week from the schedule range array of days
   * @param end - index for the last day of the week from the schedule range array of days
   */
  getCurrentWeekSummary(start: number, end: number) {
    if(end >= this.filledScheduleRange.length){
      end = this.filledScheduleRange.length - 1;
    }
    let totalHours = 0;
    let totalPayout = 0;
    for(let i = start; i <= end; i++){
      let shifts = this.fulfilledShiftsMap.get(this.filledScheduleRange[i].date.toDateString());
      if(shifts){
        let results = this.calculateDaySummary(shifts!);
        totalHours += results.hours;
        totalPayout += results.payout;
      }
    }

    this.currentScheduleTotalHours = totalHours;
    this.currentScheduleTotalPayout = totalPayout;
  }

  /**
   * Calculates and sets the hours and payout for the entire schedule.
   */
  getEntireScheduleSummary(){
    let totalHours = 0;
    let totalPayout = 0;
    for(let day of this.filledScheduleRange){
      let daySummary = this.calculateDaySummary(this.fulfilledShiftsMap.get(day.date.toDateString())!);
      totalHours += daySummary.hours;
      totalPayout += daySummary.payout;
    }

    this.entireSchedulePayout = totalPayout;
    this.entireScheduleHours = totalHours;
  }

  /**
   * Takes an employee ID and looks through each day the employee is scheduled
   * to determine if the employee is scheduled during the current week.
   * @param employeeID - string of employee's id
   * @returns true if employee is scheduled during the current week, returns false if not
   */
  isEmployeeScheduledCurrentWeek(employeeID: string){
    let startDate = this.filledScheduleRange[this.currentScheduleWeekStartIndex].date;
    let endDate = this.filledScheduleRange[this.currentScheduleWeekEndIndex].date;
    for(let shift of this.scheduledEmployeesMap.get(employeeID)!.shifts){
      if(shift.date >= startDate && shift.date <= endDate){
        return true;
      }
    }
    return false;
  }

  /**
   * Takes a start and end index for the first and last day of the current week
   * and sets the employees to display that are scheduled during the current week.
   * @param start - index for the first day of the week from the schedule range array of days
   * @param end - index for the last day of the week from the schedule range array of days
   */
  setCurrentWeekScheduledEmployees(start: number, end: number) {
    let startDate = this.filledScheduleRange[start].date;
    let endDate = this.filledScheduleRange[end].date;

    let scheduledEmployees = [];
    for(let employee of this.scheduledEmployeesMap){
      for(let shift of employee[1].shifts){
        if(shift.date >= startDate && shift.date <= endDate){
          scheduledEmployees.push(employee[0]);
          break;
        }
      }
    }
    this.currentWeekScheduledEmployees = scheduledEmployees;
  }

  /**
   * Changes the current week to the next week in the schedule
   */
  setCurrentWeekNext() {
    this.currentScheduleWeekStartIndex = this.currentScheduleWeekEndIndex + 1;
    this.currentScheduleWeekEndIndex = this.currentScheduleWeekEndIndex + 7;

    //If schedule is less than or equal to 7 days, hide next week navigation arrow.
    //Else show next week navigational arrow
    if ((this.filledScheduleRange.length - 1) <= this.currentScheduleWeekEndIndex) {
      this.nextWeekView = false;
    }
    //Display previous week navigational arrow if not already displayed
    if(!this.previousWeekView){
      this.previousWeekView = true;
    }
    this.currentScheduleWeek = this.filledScheduleRange.slice(this.currentScheduleWeekStartIndex, this.currentScheduleWeekEndIndex + 1);
    this.getCurrentWeekSummary(this.currentScheduleWeekStartIndex, this.currentScheduleWeekEndIndex);
    this.setCurrentWeekScheduledEmployees(this.currentScheduleWeekStartIndex, this.currentScheduleWeekEndIndex);
  }

  /**
   * Changes the current week to the previous week in the schedule
   */
  setCurrentWeekPrev() {
    this.currentScheduleWeekEndIndex = this.currentScheduleWeekStartIndex - 1;
    this.currentScheduleWeekStartIndex -= 7;
    //If the first day of the current week is the first day of the schedule, hide previous week navigation arrow.
    //Else show previous week navigational arrow
    if (this.currentScheduleWeekStartIndex == 0) {
      this.previousWeekView = false;
    }
    //Display next week navigational arrow if not already displayed
    if(!this.nextWeekView){
      this.nextWeekView = true;
    }
    this.currentScheduleWeek = this.filledScheduleRange.slice(this.currentScheduleWeekStartIndex, this.currentScheduleWeekEndIndex + 1);
    this.getCurrentWeekSummary(this.currentScheduleWeekStartIndex, this.currentScheduleWeekEndIndex);
    this.setCurrentWeekScheduledEmployees(this.currentScheduleWeekStartIndex, this.currentScheduleWeekEndIndex);
  }

  /**
   * Sets the current employee view to display the selected employee in the current employee view
   * @param employeeId - id of the employee to display
   */
  setCurrentEmployee(employeeId: string) {
    const employee = this.scheduledEmployeesMap.get(employeeId);
    if (employee) {
      this.currentEmployee = employee;
    } else {
      let newEmployee: ScheduledEmployee = {
        employeeInfo: this.employees.get(employeeId)!,
        shifts: [],
        positions: Array.from(this.employeePositions.get(employeeId)!),
        totalMinutes: 0,
        totalPayout: 0
      };
      this.currentEmployee = newEmployee;
    }
    this.showEmployeeView = true;
  }

  /**
   * Closes the current employee view. Triggered by the close button
   */
  closeEmployeeView() {
    this.showEmployeeView = false;
  }

  /**
   * Closes the current error message.
   */
  closeErrorMessage() {
    this.error = false;
  }

  /**
   * Generates a unique 32-character string for employee and shift ids
   * @returns
   */
  uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
    .replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  /**
   * Fulfills a shift with an employee to display on the schedule on initial schedule load
   * @param shiftDate - date of the shift
   * @param shift - object containing shift information
   * @param employeeID - id of the employee fulfilling the shift
   */
  fulfillShift(shiftDate: Date, shift: ScheduledShift, employeeID: string) {
    const newID = this.uuidv4();
    const newShift: ScheduledShift = {
      id: newID,
      date: shift.date,
      day: shift.day,
      position: shift.position,
      minutes: shift.minutes,
      scheduledEmployeeID: employeeID,
      startTime: shift.startTime,
      endTime: shift.endTime,
      breaks: shift.breaks
    };

    //If employee is already scheduled for at least one shift, add shift to their profile on scheduled employees map.
    //Else create new employee profile for scheduled employees map
    const currentEmployee = this.scheduledEmployeesMap.get(employeeID);
    if (currentEmployee) {
      currentEmployee.shifts.push(newShift);
      currentEmployee.totalMinutes += shift.minutes;
      currentEmployee.totalPayout += shift.minutes * (this.allPositions.get(shift.position)?.rate! / 60);
    } else {
      const newEmployee: ScheduledEmployee = {
        employeeInfo: this.employees.get(employeeID)!,
        shifts: [newShift],
        positions: [],
        totalMinutes: shift.minutes,
        totalPayout: shift.minutes * (this.allPositions.get(shift.position)?.rate! / 60)
      };
      this.scheduledEmployeesMap.set(employeeID, newEmployee);
    }

    if (this.fulfilledShiftsMap.has(shiftDate.toDateString())) {
      this.fulfilledShiftsMap.get(shiftDate.toDateString())?.push(newShift);
    } else {
      this.fulfilledShiftsMap.set(shiftDate.toDateString(), [newShift]);
    }

    //Remove shift that is now fulfilled from the unfulfilled shifts map
    let updatedUnfilledShifts = this.unfulfilledShiftsMap.get(shiftDate.toDateString());
    updatedUnfilledShifts = updatedUnfilledShifts?.filter((unfilledShift) => {
      return JSON.stringify(unfilledShift) !== JSON.stringify(shift);
    });
    this.unfulfilledShiftsMap.set(shiftDate.toDateString(), updatedUnfilledShifts!);

    if (!this.unsavedChanges) {
      this.unsavedChanges = true;
    }
  }

  /**
   * Fulfills a shift with an employee to display on the schedule from user's input
   * to
   * @param shiftDate - date of the shift
   * @param shift - object containing shift information
   * @param employeeID - id of the employee fulfilling the shift
   */
  fulfillShitFromDialog(shiftDate: Date, shift: ScheduledShift, employee: string) {
    this.fulfillShift(shiftDate, shift, employee);

    //If employee is not already displayed as a scheduled employee for the current week, do so
    let alreadyScheduled = false;
    for(let scheduledEmployee of this.currentWeekScheduledEmployees){
      if(scheduledEmployee === employee){
        alreadyScheduled = true;
      }
    }

    if(!alreadyScheduled){
      this.currentWeekScheduledEmployees.push(employee);
    }

    //update hours and payout for current week
    this.getCurrentWeekSummary(this.currentScheduleWeekStartIndex, this.currentScheduleWeekEndIndex);

    this.entireScheduleHours += shift.minutes;
    this.entireSchedulePayout += shift.minutes * (this.allPositions.get(shift.position)?.rate! / 60);
  }

  /**
   * Takes one employee and replaces another employee's place for a  fulfilled shift
   * @param shiftDate - date of the shift
   * @param shift - object containing shift information
   * @param scheduledEmployeeID - id of the employee to replace
   * @param replacementEmployeeID - id of replacement employee
   */
  replaceEmployee(shiftDate: Date, shift: ScheduledShift, scheduledEmployeeID: string, replacementEmployeeID: string) {
    let fulfilledShiftsDay = this.fulfilledShiftsMap.get(shiftDate.toDateString());
    let flag: boolean = true;
    for (let shift of fulfilledShiftsDay!) {
      if (shift.position == shift.position && shift.scheduledEmployeeID == scheduledEmployeeID) {
        shift.scheduledEmployeeID = replacementEmployeeID;
        flag = false;
      }
    }

    if (flag) {
      //Error finding the matching fulfilled shift in fulfilledShiftsMap
    }

    //If the employee being replaced has no other scheduled shifts during the current week,
    //remove them from the current week scheduled employees display
    let currentEmployee = this.scheduledEmployeesMap.get(scheduledEmployeeID)!;
    if(currentEmployee.shifts.length <= 1){
      this.scheduledEmployeesMap.delete(scheduledEmployeeID);

      //remove from current week scheduled employees display
      this.currentWeekScheduledEmployees = this.currentWeekScheduledEmployees.filter((employee) => {
        return employee !== scheduledEmployeeID;
      });

      if(this.showEmployeeView){
        this.closeEmployeeView();
      }
    } else {
      //Remove shift from employee's profile that is being replaced
      currentEmployee.shifts = currentEmployee.shifts.filter((currentEmployeeShift) => {
        return currentEmployeeShift.id !== shift.id;
      });

      //If the employee being replaced has other fulfilled shifts but has no other scheduled shifts during the current week,
      //remove them from the current week scheduled employees display
      if(!this.isEmployeeScheduledCurrentWeek(scheduledEmployeeID)){
        this.currentWeekScheduledEmployees = this.currentWeekScheduledEmployees.filter((employee) => {
          return employee !== scheduledEmployeeID
        });
      }
    }

    //Add shift to replacement employee's profile and add employee to
    //current week scheduled employees display
    let replacement = this.scheduledEmployeesMap.get(replacementEmployeeID);
    if (!replacement) {
      const newEmployee: ScheduledEmployee = {
        employeeInfo: this.employees.get(replacementEmployeeID)!,
        shifts: [shift],
        positions: [],
        totalMinutes: shift.minutes,
        totalPayout: shift.minutes * (this.allPositions.get(shift.position)?.rate! / 60)
      };
      this.scheduledEmployeesMap.set(replacementEmployeeID, newEmployee);
      this.currentWeekScheduledEmployees.push(replacementEmployeeID);
    } else {
      //Update employee hours and payout
      replacement.shifts.push(shift);
      replacement.totalMinutes += shift.minutes;
      replacement.totalPayout += shift.minutes * (this.allPositions.get(shift.position)?.rate! / 60);
    }

    if (!this.unsavedChanges) {
      this.unsavedChanges = true;
    }
  }

  /**
   * Moves shift to unfulfilled shifts map and
   * removes the employee from the fulfilled shift
   * @param shiftDate - date of the shift
   * @param shift - object containing shift information
   * @param scheduledEmployeeID - id of the employee to be removed from fulfilled shift
   */
  removeEmployeeFromShift(shiftDate: Date, shift: ScheduledShift, scheduledEmployeeID: string) {
    let unfilledShiftsDay = this.unfulfilledShiftsMap.get(shiftDate.toDateString());
    let newUnfilledShift = {
      id: shift.id,
      date: shift.date,
      day: shift.day,
      position: shift.position,
      minutes: shift.minutes,
      scheduledEmployeeID: scheduledEmployeeID,
      startTime: shift.startTime,
      endTime: shift.endTime,
      breaks: shift.breaks
    };

    if(unfilledShiftsDay) {
      this.unfulfilledShiftsMap.get(shiftDate.toDateString())?.push(newUnfilledShift);
    } else {
      this.unfulfilledShiftsMap.set(shiftDate.toDateString(), [newUnfilledShift]);
    }
    //Call function to delete no longer fulfilled shift
    this.removeFulfilledShift(shiftDate, shift, scheduledEmployeeID);
  }

  /**
   * Deletes the fulfilled shift from the schedule
   * @param shiftDate - date of the shift
   * @param shift - object containing shift information
   * @param scheduledEmployeeID - id of the employee fulfilling the shift
   */
  removeFulfilledShift(shiftDate: Date, shift: ScheduledShift, scheduledEmployeeID: string) {
    let fulfilledShiftsDay = this.fulfilledShiftsMap.get(shiftDate.toDateString());
    fulfilledShiftsDay = fulfilledShiftsDay?.filter((sameDayShift) => {
      return sameDayShift.id !== shift.id
    });
    this.fulfilledShiftsMap.set(shiftDate.toDateString(), fulfilledShiftsDay!);

    //If the shift was the employee's only shift, delete employee from scheduled employees map
    //and current week scheduled employees display
    let removedEmployee = this.scheduledEmployeesMap.get(scheduledEmployeeID);
    if (removedEmployee?.shifts.length! <= 1) {
      this.scheduledEmployeesMap.delete(scheduledEmployeeID);

      this.currentWeekScheduledEmployees = this.currentWeekScheduledEmployees.filter((employee) => {
        return employee !== scheduledEmployeeID;
      });

      if(this.showEmployeeView){
        this.closeEmployeeView();
      }
    } else {
      //Remove shift from employee's profile
      removedEmployee!.shifts = removedEmployee!.shifts.filter((scheduledShift) => {
        return scheduledShift.id !== shift.id;
      });

      //Update employee hours and payout
      removedEmployee!.totalMinutes -= shift.minutes;
      removedEmployee!.totalPayout -= (shift.minutes * (this.allPositions.get(shift.position)?.rate! / 60));

      //If deleted shift was the employee's only shift for the current week,
      //delete employee from current week scheduled employees display
      if(!this.isEmployeeScheduledCurrentWeek(scheduledEmployeeID)){
        this.currentWeekScheduledEmployees = this.currentWeekScheduledEmployees.filter((employee) => {
          return employee !== scheduledEmployeeID;
        }
      )}
    }

    //Update current week hours and payout
    this.currentScheduleTotalHours -= shift.minutes;
    this.currentScheduleTotalPayout -= (shift.minutes * (this.allPositions.get(shift.position)?.rate! / 60));

    //Update total schedule hours and payout
    this.entireScheduleHours -= shift.minutes;
    this.entireSchedulePayout -= (shift.minutes * (this.allPositions.get(shift.position)?.rate! / 60));

    if (!this.unsavedChanges) {
      this.unsavedChanges = true;
    }
  }

  /**
   * Deletes the unfulfilled shift from the schedule
   * @param shift - object containing shift information
   */
  removeUnfulfilledShift(shift: ScheduledShift){
    let unfulfilledShiftsDay = this.unfulfilledShiftsMap.get(shift.date.toDateString());
    unfulfilledShiftsDay = unfulfilledShiftsDay?.filter((sameDayShift) => {
      return sameDayShift.id !== shift.id
    });
    this.unfulfilledShiftsMap.set(shift.date.toDateString(), unfulfilledShiftsDay!);

    if (!this.unsavedChanges) {
      this.unsavedChanges = true;
    }
  }

  /**
   * Takes an employee and a shift and checks employee's schedule for overlapping fulfilled shifts
   * to see if the employee is available to fulfill specified shift.
   * @param employeeId
   * @param shiftDate - date of the shift
   * @param shiftStart - time of start of the shift
   * @param shiftEnd - time of end of the shift
   * @returns true if employee is available to fulfill shift, false if not
   */
  checkEmployeeScheduleAvailability(employeeId: string, shiftDate: Date, shiftStart: string, shiftEnd: string): boolean {
    const employee = this.scheduledEmployeesMap.get(employeeId);
    //Check if shift ends on a different day than the start time, for example overnight shifts

    if(parseInt(shiftStart.substring(0, 2)) > parseInt(shiftEnd.substring(0, 2))){
      shiftEnd = (parseInt(shiftEnd.substring(0, 2)) + 24).toString();
    }

    if(employee) {
      for (let shift of employee.shifts) {
        //Skip availability check of any shift not on the same day
        if (shift.date == shiftDate) {
          let currentShiftStart: number = parseInt(shift.startTime.substring(0, 2));
          let currentShiftEnd: number = parseInt(shift.endTime.substring(0, 2));
          //Check if the current shift ends on a different day than the start time, for example overnight shifts
          if(currentShiftStart > currentShiftEnd){
            currentShiftEnd += 24;
          }

          //If the specified shift ends anytime after the current fulfilled shift starts, and
          //if the current fulfilled shift ends after the specified shift starts,
          //both shifts are incompatible to be fulfilled by the same employee. Return false
          if(parseInt(shiftEnd.substring(0, 2)) > currentShiftStart) {
            if(currentShiftEnd > parseInt(shiftStart.substring(0, 2))) {
              return false;
            }
          }

          //If the current fulfilled shift ends anytime after the specified shift starts, and
          //if the specified shift ends after the current fulfilled shift starts,
          //both shifts are incompatible to be fulfilled by the same employee. Return false
          if(currentShiftEnd > parseInt(shiftStart.substring(0, 2))) {
            if(parseInt(shiftEnd.substring(0, 2)) > currentShiftStart) {
              return false;
            }
          }

          //If both the current fulfilled shift and specified shift share the same starting or ending hours, and
          //if the current fulfilled shift's starting minutes is less or greater than the specified shift's ending minutes,
          //both shifts are incompatible to be fulfilled by the same employee. Return false
          if((currentShiftStart == parseInt(shiftEnd.substring(0, 2))) || (currentShiftEnd == parseInt(shiftStart.substring(0, 2)))) {
            if((parseInt(shift.startTime.substring(3, 5)) < parseInt(shiftEnd.substring(3, 5))) || (parseInt(shift.startTime.substring(3, 5)) > parseInt(shiftEnd.substring(3, 5)))) {
              return false;
            }
          }
        }
      }
      //If no overlaps in the employee's schedule occur between the employee's fulfilled shift(s) on the same day
      //and the specified shift, return true
      return true;
    } else {
      //If the employee has no other fulfilled shift(s) on the same day as the specified shift,
      //the employee is available. Return true
      return true;
    }
  }

  /**
   * Sends query for user specific list of employees based off of positions and days,
   * then displays back to user. Triggered on any filter user input change
   */
  filterEmployeeList = () => {
    this.employeeFilteredList = new Map();

    //Grab every user selected position to find qualified and available employees for
    let positions = [];
    for (const [key, value] of Object.entries(this.positionFilters.value)) {
      if (`${value}` == 'true') {
        positions.push(`${key}`);
      }
    }

    //Send query with user selected positions and days to find qualified and available employees for
    this.employeesService.findEmployees(this.selectedFilterDays.value!, positions)
      .subscribe({
        next: (employees) => {
          //Display each employee matching user's selected filters with their respective positions
          for (const [key, value] of Object.entries(employees)) {
            this.employeeFilteredList.set(`${key}`, `${value}`.split(','));
          }
        },
        error: (response) => {
          this.error = true;
          this.errorMessage = 'Error finding available employees';
        }
      });
  }

  /**
   * Changes the filter color of a position and returns the old color to the available colors selection
   * @param position - the position to change the filter color of
   * @param oldColor - the current filter color before color change
   * @param newColor - the new color to change to
   */
  changePositionFilterColor(position: string, oldColor: string, newColor: string) {
    if (this.positionFilterColors.has(position)) {
      this.availablePositionFilterColors.delete(newColor);
      this.availablePositionFilterColors.add(oldColor);
      this.positionFilterColors.set(position, newColor);
    }
  }

  /**
   * Opens a dialogue window displaying the information about the shift
   * and any available employees to fulfill the shift.
   * @param shiftDate - date of the shift
   * @param shift - object with the shift information
   */
  openFulfillShiftDialog(shiftDate: Date, shift: ScheduledShift): void {
    this.dialog.open(FulfillShiftDialogComponent, {
      data: {
        date: shiftDate,
        shift: shift,
        removeShift: () => {
          this.removeUnfulfilledShift(shift);
        },
        fulfillShift: (shiftDate: Date, shift: ScheduledShift, employee: string) => {
          this.fulfillShitFromDialog(shiftDate, shift, employee);
        },
        checkEmployeeScheduleAvailability: (employeeId: string, shiftDate: Date, start: string, end: string) => {
          return this.checkEmployeeScheduleAvailability(employeeId, shiftDate, start, end);
        },
        getEmployee: (employeeId: string) => {
          return this.employees.get(employeeId);
        }
      },
      width: '500px',
    });
  }

  /**
   * Opens a dialogue window displaying the information about the fulfilled shift
   * and options to edit the shift such as:
   * replacing the employee fulfilling the shift,
   * deleting the shift completely,
   * or remove the employee from the shift and the shift is now unfulfilled.
   * @param scheduledEmployee
   * @param shiftDate
   * @param shift
   */
  openEditShiftDialog(scheduledEmployee: Employee, shiftDate: Date, shift: {}): void {
    this.dialog.open(EditShiftDialogComponent, {
      data: {
        employee: scheduledEmployee,
        date: shiftDate,
        shift: shift,
        getEmployee: (employeeId: string) => {
          return this.employees.get(employeeId);
        },
        setCurrentEmployee: (employeeId: string) => {
          return this.setCurrentEmployee(employeeId);
        },
        checkEmployeeScheduleAvailability: (employeeId: string, shiftDate: Date, start: string, end: string) => {
          return this.checkEmployeeScheduleAvailability(employeeId, shiftDate, start, end);
        },
        replaceEmployee: (shiftDate: Date, shift: ScheduledShift, scheduledEmployeeID: string, replacementEmployeeID: string) => {
          return this.replaceEmployee(shiftDate, shift, scheduledEmployeeID, replacementEmployeeID);
        },
        removeEmployeeFromShift: (shiftDate: Date, shift: ScheduledShift, scheduledEmployeeID: string) => {
          return this.removeEmployeeFromShift(shiftDate, shift, scheduledEmployeeID);
        },
        removeShift: (shiftDate: Date, shift: ScheduledShift, scheduledEmployeeID: string) => {
          return this.removeFulfilledShift(shiftDate, shift, scheduledEmployeeID);
        }
      },
      width: '500px',
    });
  }

  openNotesDialog(): void {
    this.dialog.open(NotesDialogComponent, {
      data: {
        notes: this.scheduleNotes,
        updateNotes: (notes: string) => {
          this.scheduleNotes = notes;
          this.unsavedChanges = true;
        }
      },
      width: '500px',
    });
  }

  /**
   * Creates a save file for the current schedule
   */
  saveChanges() {
    //If the current schedule name is blank, display error and do not save changes
    if(this.scheduleName === ''){
      this.error = true;
      this.errorMessage = 'A schedule name is required to save changes';
      return;
    }

    //Check all other session saved schedules to avoid duplicate schedule names
    let duplicateNameFlag = false;
    if (this.savedSchedules.length != 0) {
      for (let schedule of this.savedSchedules) {
        if (schedule.name == this.scheduleName) {
          duplicateNameFlag = true;
        }
      }
    }

    if (duplicateNameFlag) {
      //Display error and do not save changes
      this.error = true;
      this.errorMessage = 'Duplicate name error: ' + this.scheduleService.getCurrentScheduleName() + ' is already taken';
      return;
    } else {
      //Export schedule and save changes
      let fulfilledShifts: {day: string, shifts: ScheduledShift[]}[] = [];
      let unfulfilledShifts: {day: string, shifts: ScheduledShift[]}[] = [];

      for (let [day, shifts] of this.fulfilledShiftsMap) {
        let newDay = {
          day: day,
          shifts: shifts
        };
        fulfilledShifts.push(newDay);
      }

      for (let [day, shifts] of this.unfulfilledShiftsMap) {
        let newDay = {
          day: day,
          shifts: shifts
        };
        unfulfilledShifts.push(newDay);
      }

      let scheduledEmployees: ScheduledEmployee[] = [];
      for(let [employee, profile] of this.scheduledEmployeesMap) {
        scheduledEmployees.push(profile);
      }

      let filterColors = [];
      for(let position of this.positionFilterColors){
        filterColors.push({position: position[0], color: position[1]});
      }

      let currentSchedule: SavedSchedule = {
        start: this.scheduleRange.start,
        end: this.scheduleRange.end,
        name: this.scheduleName,
        filterColors: filterColors,
        fulfilledShifts: fulfilledShifts,
        unfulfilledShifts: unfulfilledShifts,
        scheduledEmployees: scheduledEmployees,
        notes: this.scheduleNotes
      };

      if (this.scheduleService.getSampleOpen()) {
        this.scheduleService.saveNewSchedule(currentSchedule);
      } else if (this.scheduleService.getSavedOpen()) {
        this.scheduleService.updateSavedSchedule(currentSchedule);
      } else {
        this.scheduleService.saveNewSchedule(currentSchedule);
      }
      //Reset detected unsaved changes after saving
      this.unsavedChanges = false;
    }
  }

  /**
   * Moves the table rows of the event's selected current week scheduled employee.
   * Triggered by dragging and dropping a current week scheduled employee around the table
   * @param event - the drag event
   */
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.currentWeekScheduledEmployees, event.previousIndex, event.currentIndex);
  }
}
