import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Employee } from '../models/employee.model';
import { Shift } from '../models/shift.model';
import { ScheduledShift } from '../models/scheduleShift.model';
import { UnfilledShift } from '../models/unfilledShift.model';
import { SavedSchedule } from '../models/savedSchedule.model';
import { ScheduledEmployee } from '../models/scheduledEmployee.model';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  constructor(private http: HttpClient) {}
  baseApiUrl: string = environment.baseApiUrl;
  private openFromSample: boolean = false;
  private openFromSaved: boolean = false;
  private savedFilterColors: {position: string, color: string}[] = [];
  private fulfilledShifts: {day: string, shifts: ScheduledShift[]}[] = [];
  private currentScheduleName: string = '';
  private scheduleRange: {start: Date, end: Date} = {start: new Date(0), end: new Date(0)};
  private scheduleNotes: string = ''
  private unfulfilledCreatedShifts: Shift[] = [];
  private fulfilledCreatedShifts: {shiftDate: Date, shift: UnfilledShift, employee: string}[] = [];
  private unfulfilledShifts: {day: string, shifts: ScheduledShift[]}[] = [];
  private scheduledEmployees: ScheduledEmployee[] = [];
  private savedSchedules: SavedSchedule[] = [];

  /**
   * Opens the selected saved schedule to view and edit
   * @param schedule - Object containing the schedule information
   */
  openSavedSchedule(schedule: SavedSchedule) {
    this.openFromSaved = true;
    this.openFromSample = false;
    this.savedFilterColors = schedule.filterColors;
    this.fulfilledShifts = schedule.fulfilledShifts;
    this.unfulfilledShifts = schedule.unfulfilledShifts;
    this.scheduleRange = {start: schedule.start, end: schedule.end};
    this.scheduleNotes = schedule.notes;
    this.currentScheduleName = schedule.name;
    this.scheduledEmployees = schedule.scheduledEmployees;
  }

  /**
   * Opens the selected sample schedule to view and edit
   * @param name - name of the schedule
   * @param start - first day of the schedule
   * @param end - last day of the schedule
   * @param shifts - array of fulfilled shifts from the schedule. All sample schedules contain 100% fulfilled shifts and 0 unfulfilled shifts
   */
  openSampleSchedule(name: string, start: Date, end: Date, shifts: {shiftDate: Date, shift: UnfilledShift, employee: string}[]) {
    this.currentScheduleName = name;
    this.scheduleRange = {start: start, end: end};
    this.openFromSample = true;
    this.fulfilledCreatedShifts = shifts;
  }

  /**
   * @returns an array of all scheduled employees from the schedule
   */
  getScheduledEmployees() {
    return this.scheduledEmployees;
  }

  /**
   * Sets the opened from sampled flag true.
   */
  setSampleOpen() {
    this.openFromSample = true;
  }

  /**
   * @returns true if the current schedule was opened as a sample, false if not.
   */
  getSampleOpen() {
    return this.openFromSample;
  }

  /**
   * Sets the opened from saved flag true.
   */
  setSavedOpen() {
    this.openFromSaved = true;
  }

  /**
   * @returns true if the current schedule was opened as a saved, false if not.
   */
  getSavedOpen() {
    return this.openFromSaved;
  }

  /**
   * @returns an array of all saved schedules
   */
  getSavedSchedules() {
    return this.savedSchedules;
  }

  /**
   * Takes the current schedule and saves it as a new schedule. Saved schedules are set to only last per session
   * @param schedule - object containing the new schedule information
   */
  saveNewSchedule(schedule: SavedSchedule) {
    this.savedSchedules.push(schedule);
  }

  /**
   * Takes the current schedule and updates the save file with the same schedule name. Saved schedules are set to only last per session
   * @param schedule - object containing the updated schedule information
   */
  updateSavedSchedule(schedule: SavedSchedule) {
    let duplicateFlag = false;
    this.savedSchedules = this.savedSchedules.filter((currentSchedule) => {
      return currentSchedule.name !== schedule.name;
    });
    this.savedSchedules.push(schedule);
  }

  /**
   * @returns an array containing each position title and its respective filter color
   */
  getFilterColors() {
    return this.savedFilterColors;
  }

  /**
   * @returns the name of the current schedule
   */
  getCurrentScheduleName() {
    return this.currentScheduleName;
  }

  /**
   *
   * @returns the notes for the current schedule
   */
  getScheduleNotes() {
    return this.scheduleNotes;
  }

  /**
   * Takes two dates and sets the first and last day of the schedule
   * @param start - the first day of the schedule
   * @param end - the last day of the schedule
   */
  setScheduleRange(start: Date, end: Date){
    this.scheduleRange = {start: start, end: end};
  }

  /**
   * @returns an object containing the first and last day of the schedule
   */
  getScheduleRange() {
    return this.scheduleRange;
  }

  /**
   * Takes an array of fulfilled shifts from a saved schedule and sets as the current schedule's fulfilled shifts
   * @param shifts - array of fulfilled shifts to load and display for the current schedule
   */
  setFulfilledSavedShifts(shifts: {day: string, shifts: ScheduledShift[]}[]) {
    this.fulfilledShifts = shifts;
  }

  /**
   * @returns an array of fulfilled shifts to loaded from a saved schedule to display for the current schedule
   */
  getFulfilledSavedShifts() {
    return this.fulfilledShifts;
  }

  /**
   * Takes an array of unfulfilled shifts generated from the schedule wizard and sets as the current schedule's unfulfilled shifts
   * @param shifts - array of unfulfilled shifts to load and display for the current schedule
   */
  setUnfulfilledCreatedShifts(shifts: Shift[]){
    this.unfulfilledCreatedShifts = shifts;
  }

  /**
   * @returns an array of unfulfilled shifts loaded from the schedule wizard to display for the current schedule
   */
  getUnfulfilledCreatedShifts() {
    return this.unfulfilledCreatedShifts;
  }

  /**
   * @returns an array of fulfilled shifts generated from the sample schedules page to display for the current schedule
   */
  getFulfilledSampleShifts() {
    return this.fulfilledCreatedShifts;
  }

  /**
   * @returns an array of fulfilled shifts loaded from a saved schedule to display for the current schedule
   */
  getUnfulfilledSavedShifts() {
    return this.unfulfilledShifts;
  }

  /**
   * Deletes all saved schedules. Triggered on application close
   */
  resetSchedules() {
    this.savedSchedules = [];
  }

  /**
   * Resets the schedule loading flags. Triggered on page leave of schedule creator page
   */
  reset() {
    this.openFromSample = false;
    this.openFromSaved = false;
  }
}
