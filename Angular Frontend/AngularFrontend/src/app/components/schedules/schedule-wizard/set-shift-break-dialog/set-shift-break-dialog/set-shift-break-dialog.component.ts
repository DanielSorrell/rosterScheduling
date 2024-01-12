import { Component, Inject, Input } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, Validators, FormGroup, FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-set-shift-break-dialog',
  templateUrl: './set-shift-break-dialog.component.html',
  styleUrls: ['./set-shift-break-dialog.component.css']
})
export class SetShiftBreakDialogComponent {
  constructor(private _formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<SetShiftBreakDialogComponent>) { }

  start = new FormControl('', Validators.required);
  end = new FormControl('', Validators.required);
  error: boolean = false;
  errorMessage: string = '';

  closeErrorMessage() {
    this.error = false;
  }

  setBreak(){
    let breakStartHour: number = parseInt(this.start.value!.substring(0, 2));
    let breakEndHour: number = parseInt(this.end.value!.substring(0, 2));
    //Check for overnight break logic
    if(breakStartHour >  breakEndHour){
      breakEndHour += 24;
    }
    if(this.start.hasError('required') || this.end.hasError('required')){
      this.error = true;
      this.errorMessage = 'Please fill out missing time fields';
      return;
    } else if(this.start.value === this.end.value){
      this.error = true;
      this.errorMessage = 'Break has to be at least one minute long';
      return;
    } else if(breakStartHour < this.data.shiftStart.substring(0, 2) || breakEndHour > this.data.shiftEnd.substring(0, 2)){
      this.error = true;
      this.errorMessage = 'Break has to be set within the shift start and end time';
      return;
    } else {
      for(let currentBreak of this.data.breaks){

        //Check if current break overlaps the start of user defined break
        if(parseInt(currentBreak.startTime.substring(0, 2)) < breakStartHour){
          if(parseInt(currentBreak.endTime.substring(0, 2)) > breakStartHour){
            this.error = true;
            this.errorMessage = 'This break will overlap an existing break and therefore cannot be added';
            return;
          } else if(parseInt(currentBreak.endTime.substring(0, 2)) === breakStartHour){
            if(parseInt(currentBreak.endTime.substring(3, 5)) > parseInt(this.start.value!.substring(3, 5))){
              //If the current break ending hour is the same time as the user defined break starting hour
              //and the current break time ending minutes is greater than the user defined break starting minutes,
              //the current break cannot end after the user defined break has already started
              this.error = true;
              this.errorMessage = 'This break will overlap an existing break and therefore cannot be added';
              return;
            }
          }

        //Check if current break overlaps the end of user defined break
        } else if(parseInt(currentBreak.endTime.substring(0, 2)) > breakEndHour){
          if(parseInt(currentBreak.startTime.substring(0, 2)) < breakEndHour){
            //If the current break starting hour is less than the user defined break starting hour,
            //the current break cannot start before the user defined break has ended
            this.error = true;
            this.errorMessage = 'This break will overlap an existing break and therefore cannot be added';
            return;
          } else if(parseInt(currentBreak.startTime.substring(0, 2)) === breakEndHour){
            if(parseInt(currentBreak.startTime.substring(3, 5)) < parseInt(this.end.value!.substring(3, 5))){
              //If the current break starting hour is the same time as the user defined break ending hour
              //and the current break starting minutes is less than the user defined break ending minutes,
              //the current break cannot start before the user defined break ends
              this.error = true;
              this.errorMessage = 'This break will overlap an existing break and therefore cannot be added';
              return;
            }
          }
        } else {
          //The current break cannot start and end during the time of the user defined break
          this.error = true;
          this.errorMessage = 'This break will overlap an existing break and therefore cannot be added';
          return;
        }
      }
      this.data.addBreak(this.start.value, this.end.value);
      this.dialogRef.close();
    }
  }
}
