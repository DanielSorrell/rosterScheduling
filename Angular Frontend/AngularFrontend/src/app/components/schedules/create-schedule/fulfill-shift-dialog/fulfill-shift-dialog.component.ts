import { Component, Inject, Input } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormBuilder, Validators, FormGroup, FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { EmployeesService } from 'src/app/services/employees.service';
import { Employee } from 'src/app/models/employee.model';
import { UnfilledShift } from 'src/app/models/unfilledShift.model';
import { Shift } from '../../../../models/shift.model';

@Component({
  selector: 'app-fulfill-shift-dialog',
  templateUrl: './fulfill-shift-dialog.component.html',
  styleUrls: ['./fulfill-shift-dialog.component.css']
})
export class FulfillShiftDialogComponent {
  constructor(private employeesService: EmployeesService, @Inject(MAT_DIALOG_DATA) public data: any) {}

  availableEmployees: Employee[] = [];
  selectedAvailableEmployeeIndex: any;
  isLoading: boolean = true;
  selectedFilter: string = 'Fulfill';
  error: boolean = false;
  errorMessage: string = '';

  ngOnInit(): void {
    this.employeesService.findEmployees([this.data.date], [this.data.shift.position])
    .subscribe({
      next: (employees) => {
        for(const [key, value] of Object.entries(employees)){
          if(this.data.checkEmployeeScheduleAvailability(`${key}`, this.data.date, this.data.shift.startTime, this.data.shift.endTime)){
            this.availableEmployees.push(this.data.getEmployee(`${key}`));
          }
        }
        this.isLoading = false;
      },
      error: (response) => {
        this.isLoading = false;
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

  selectOption() {
    if(this.selectedFilter === 'Fulfill'){
      this.data.fulfillShift(this.data.date, this.data.shift, this.availableEmployees[this.selectedAvailableEmployeeIndex].id);
    } else if(this.selectedFilter === 'Delete'){
      this.data.removeShift();
    }
  }

  closeErrorMessage() {
    this.error = false;
  }
}
