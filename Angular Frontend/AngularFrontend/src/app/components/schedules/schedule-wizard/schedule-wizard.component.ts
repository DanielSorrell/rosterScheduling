import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {EmployeesService} from 'src/app/services/employees.service';
import {FormBuilder, Validators, FormGroup, FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatSidenavModule} from '@angular/material/sidenav';
import {NgIf, JsonPipe} from '@angular/common';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatNativeDateModule} from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import {MatTabsModule} from '@angular/material/tabs';
import {MatDialog, MatDialogRef, MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { Shift } from 'src/app/models/shift.model';
import { SetShiftBreakDialogComponent } from './set-shift-break-dialog/set-shift-break-dialog/set-shift-break-dialog.component';
import { ScheduleService } from 'src/app/services/schedule.service';

@Component({
  selector: 'app-schedule-wizard',
  templateUrl: './schedule-wizard.component.html',
  styleUrls: ['./schedule-wizard.component.css'],
})
export class ScheduleWizardComponent {
  constructor(private employeeService: EmployeesService, private _formBuilder: FormBuilder, public dialog: MatDialog, private router: Router, private scheduleService: ScheduleService) {}

  shifts: Shift[] = [
    {
      error: false,
      id: this.uuidv4(),
      position: 'Manager',
      instances: 1,
      startTime: '09:00',
      endTime: '16:00',
      minutes: 390,
      breaks: [
        {
          startTime: '12:15',
          endTime: '12:45'
        },
        {
          startTime: '13:15',
          endTime: '13:45'
        },
        {
          startTime: '15:00',
          endTime: '15:30'
        },
      ],
      everyday: true,
      mon: false,
      tue: false,
      wed: false,
      thu: false,
      fri: false,
      sat: false,
      sun: false,
    },
    {
      error: false,
      id: this.uuidv4(),
      position: 'Host',
      instances: 2,
      startTime: '09:00',
      endTime: '16:00',
      minutes: 390,
      breaks: [
        {
          startTime: '11:45',
          endTime: '12:15'
        }
      ],
      everyday: true,
      mon: false,
      tue: false,
      wed: false,
      thu: false,
      fri: false,
      sat: false,
      sun: false,
    },
    {
      error: false,
      id: this.uuidv4(),
      position: 'Server',
      instances: 3,
      startTime: '09:00',
      endTime: '16:00',
      minutes: 390,
      breaks: [
        {
          startTime: '12:15',
          endTime: '12:45'
        }
      ],
      everyday: true,
      mon: false,
      tue: false,
      wed: false,
      thu: false,
      fri: false,
      sat: false,
      sun: false,
    },
    {
      error: false,
      id: this.uuidv4(),
      position: 'Busser',
      instances: 2,
      startTime: '09:00',
      endTime: '16:00',
      minutes: 390,
      breaks: [
        {
          startTime: '12:15',
          endTime: '12:45'
        }
      ],
      everyday: true,
      mon: false,
      tue: false,
      wed: false,
      thu: false,
      fri: false,
      sat: false,
      sun: false,
    },
    {
      error: false,
      id: this.uuidv4(),
      position: 'Cleaner',
      instances: 2,
      startTime: '18:00',
      endTime: '23:00',
      minutes: 300,
      breaks: [],
      everyday: true,
      mon: false,
      tue: false,
      wed: false,
      thu: false,
      fri: false,
      sat: false,
      sun: false,
    },
    {
      error: false,
      id: this.uuidv4(),
      position: 'Opening help',
      instances: 2,
      startTime: '22:00',
      endTime: '04:00',
      minutes: 360,
      breaks: [],
      everyday: true,
      mon: false,
      tue: false,
      wed: false,
      thu: false,
      fri: false,
      sat: false,
      sun: false,
    }
  ];

  isEditable = true;
  breaks: { startTime: string, endTime: string}[] = [];
  error: boolean = false;
  errorMessage: string = '';
  positions: Set<string> = new Set();

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  shiftFormGroup = this._formBuilder.group({
    shiftStartTime: '',
    shiftEndTime: '',
    position: '',
    instances: 1,
    everyday: [false],
    monday: [false],
    tuesday: [false],
    wednesday: [false],
    thursday: [false],
    friday: [false],
    saturday: [false],
    sunday: [false],
  });

  ngOnInit(): void {
    this.employeeService.getAllPositions()
    .subscribe({
      next: (positions) => {
        for(let position of positions){
          this.positions.add(position.title);
        }
      },
      error: (response) => {
        this.error = true;
        this.errorMessage = 'Error loading positions to assign to the employee';
      }
    });
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

  closeErrorMessage() {
    this.error = false;
  }

  addBreak(start: string, end: string){
    const shiftBreak = {
      startTime: start,
      endTime: end
    };
    this.breaks.push(shiftBreak);
  }

  deleteBreak(start: string, end: string){
    this.breaks = this.breaks.filter((value) => {
      return value.startTime !== start && value.endTime !== end
    });
  }

  deleteShift(shift: Shift){
    this.shifts = this.shifts.filter((loop) => {
      return loop.id !== shift.id;
    })
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

  displayShiftError(shiftId: string){
    this.error = true;
    this.errorMessage = 'Please edit the shifts to fix the error';

    for(let shift of this.shifts){
      if(shift.id === shiftId){
        shift.error = true;
      }
    }
  }

  openDialog(): void {
    if(!this.shiftFormGroup.value.shiftStartTime || !this.shiftFormGroup.value.shiftEndTime){
      this.error = true;
      this.errorMessage = 'Shift start and end time must be set before adding a break';
      return;99
    }

    this.dialog.open(SetShiftBreakDialogComponent, {
      data: {
        breaks: this.breaks,
        shiftStart: this.shiftFormGroup.value.shiftStartTime,
        shiftEnd: this.shiftFormGroup.value.shiftEndTime,
        addBreak: (start: string, end: string) => {
          this.addBreak(start, end);
        },
        deleteBreak: (start: string, end: string) => {
          this.deleteBreak(start, end);
        },
      },
      width: '250px',
    });
  }

  addShift(){
    if(!this.shiftFormGroup.value.shiftStartTime || !this.shiftFormGroup.value.shiftEndTime){
      this.error = true;
      this.errorMessage = 'Shift start and end time must be set before adding a break to this shift';
      return;
    } else if(!this.shiftFormGroup.value.position){
      this.error = true;
      this.errorMessage = 'Position must be set before adding this shift';
      return;
    } else if(!this.shiftFormGroup.value.instances || this.shiftFormGroup.value.instances < 1){
      this.error = true;
      this.errorMessage = 'Shift start and end time must be set before adding a break to this shift';
      return;
    } else if(!this.shiftFormGroup.value.everyday && !this.shiftFormGroup.value.monday && !this.shiftFormGroup.value.tuesday && !this.shiftFormGroup.value.wednesday && !this.shiftFormGroup.value.thursday && !this.shiftFormGroup.value.friday && !this.shiftFormGroup.value.saturday && !this.shiftFormGroup.value.sunday){
      this.error = true;
      this.errorMessage = 'At least one day is required to schedule this shift';
      return;
    }

    let totalShiftMinutes = parseInt(this.shiftFormGroup.value.shiftEndTime!.substring(this.shiftFormGroup.value.shiftEndTime!.indexOf(':') + 1, this.shiftFormGroup.value.shiftEndTime!.length + 1)) - parseInt(this.shiftFormGroup.value.shiftStartTime!.substring(this.shiftFormGroup.value.shiftStartTime!.indexOf(':') + 1, this.shiftFormGroup.value.shiftStartTime!.length + 1));
    let startingMinutes = parseInt(this.shiftFormGroup.value.shiftEndTime!.substring(this.shiftFormGroup.value.shiftEndTime!.indexOf(':') + 1, this.shiftFormGroup.value.shiftEndTime!.length + 1));
    let endingMinutes = parseInt(this.shiftFormGroup.value.shiftStartTime!.substring(this.shiftFormGroup.value.shiftStartTime!.indexOf(':') + 1, this.shiftFormGroup.value.shiftStartTime!.length + 1));
    let startingHour = parseInt(this.shiftFormGroup.value.shiftStartTime!.substring(0, this.shiftFormGroup.value.shiftStartTime!.indexOf(':')));
    let endingHour = parseInt(this.shiftFormGroup.value.shiftEndTime!.substring(0, this.shiftFormGroup.value.shiftEndTime!.indexOf(':')));

    if(endingHour > startingHour && endingMinutes >= startingMinutes){
      //Count the hours
      totalShiftMinutes += (endingHour - startingHour) * 60;
    }

    if (this.breaks.length > 0) {
      for (const breakTime of this.breaks) {
        let minutes: number = parseInt(breakTime.endTime.substring(3, 5)) - parseInt(breakTime.startTime.substring(3, 5));
        totalShiftMinutes -= minutes;
      }
    }

    let newShift: Shift = {
      error: false,
      id: this.uuidv4(),
      position: this.shiftFormGroup.value.position,
      instances: this.shiftFormGroup.value.instances!,
      startTime: this.shiftFormGroup.value.shiftStartTime!,
      endTime: this.shiftFormGroup.value.shiftEndTime!,
      minutes: totalShiftMinutes,
      breaks: this.breaks,
      everyday: this.shiftFormGroup.value.everyday!,
      mon: this.shiftFormGroup.value.monday!,
      tue: this.shiftFormGroup.value.tuesday!,
      wed: this.shiftFormGroup.value.wednesday!,
      thu: this.shiftFormGroup.value.thursday!,
      fri: this.shiftFormGroup.value.friday!,
      sat: this.shiftFormGroup.value.saturday!,
      sun: this.shiftFormGroup.value.sunday!,
    };

    this.shiftFormGroup.value.position = '';
    this.shiftFormGroup.value.instances = 1
    this.shiftFormGroup.value.shiftStartTime = '';
    this.shiftFormGroup.value.shiftEndTime = '';
    this.shiftFormGroup.value.everyday = null;
    this.shiftFormGroup.value.monday = null;
    this.shiftFormGroup.value.tuesday = null;
    this.shiftFormGroup.value.wednesday = null;
    this.shiftFormGroup.value.thursday = null;
    this.shiftFormGroup.value.friday = null;
    this.shiftFormGroup.value.saturday = null;
    this.shiftFormGroup.value.sunday = null;
    this.shifts.push(newShift);
  }

  editShift(shift: Shift){
    console.log(shift);
    for(let i = 0; i < this.shifts.length; i++){
      if(this.shifts[i].id === shift.id){
        this.shifts[i] = shift;
      }
    }
  }

  submit(){
    if(!this.range.value.start || !this.range.value.end){
      this.error = true;
      this.errorMessage = 'Schedule range must have a start and end date';
      return;
    }

    for(let shift of this.shifts){
      if(shift.error){
        console.log('foo');
        this.error = true;
        this.errorMessage = 'Please edit the shift(s) to fix the errors';
        return;
      }
    }

    this.scheduleService.setScheduleRange(this.range.value.start!, this.range.value.end!);
    this.scheduleService.setUnfulfilledCreatedShifts(this.shifts);
    this.router.navigate(['schedule/edit']);
  }
}
