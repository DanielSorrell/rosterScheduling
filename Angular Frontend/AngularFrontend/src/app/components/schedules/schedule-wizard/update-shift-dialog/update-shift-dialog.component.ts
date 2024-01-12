import { Component, Inject, Input, Output, EventEmitter } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, Validators, FormGroup, FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Shift } from 'src/app/models/shift.model';
import { Position } from '../../../../models/position.model';

@Component({
  selector: 'app-update-shift-dialog',
  templateUrl: './update-shift-dialog.component.html',
  styleUrls: ['./update-shift-dialog.component.css']
})
export class UpdateShiftDialogComponent {
  constructor(private _formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<UpdateShiftDialogComponent>) {}

  @Output() delete = new EventEmitter();
  @Output() setError = new EventEmitter();

  updatedShift: Shift = {
    error: false,
    id: '',
    position: '',
    instances: 1,
    startTime: '',
    endTime: '',
    minutes: 0,
    breaks: [],
    everyday: false,
    mon: false,
    tue: false,
    wed: false,
    thu: false,
    fri: false,
    sat: false,
    sun: false,
  };

  shiftFormGroup = this._formBuilder.group({
    shiftStartTime: new FormControl<string>(this.data.shift.startTime, Validators.required),
    shiftEndTime: new FormControl<string>(this.data.shift.endTime, Validators.required),
    position: new FormControl<string>(this.data.shift.position),
    breaks: new FormControl<{startTime: string, endTime: string}[]>(this.data.shift.breaks, Validators.required),
    instances: new FormControl<number>(this.data.shift.instances, Validators.required),
    everyday: [this.data.shift.everyday],
    monday: [this.data.shift.mon],
    tuesday: [this.data.shift.tue],
    wednesday: [this.data.shift.wed],
    thursday: [this.data.shift.thu],
    friday: [this.data.shift.fri],
    saturday: [this.data.shift.sat],
    sunday: [this.data.shift.sun],
  });
  unsavedTimeChanges: boolean = false;
  canAddBreak: boolean = true;
  errorMessage: string = '';

  ngOnInit(): void {
    this.updatedShift.error = this.data.shift.error;

    if(this.data.shift.error){
      this.errorMessage = this.data.errorMessage;
    }
  }

  closeErrorMessage() {
    this.updatedShift.error = false;
  }

  showNewBreak(){
    this.shiftFormGroup.value.breaks?.push({startTime: '', endTime: ''});
    this.canAddBreak = false;
  }

  detectUnsavedTimeChanges(){
    if(!this.unsavedTimeChanges){
      this.unsavedTimeChanges = true;
    }

    if(this.shiftFormGroup.value.breaks![this.shiftFormGroup.value.breaks!.length - 1].startTime.length === 5 && this.shiftFormGroup.value.breaks![this.shiftFormGroup.value.breaks!.length - 1].endTime.length === 5){
      this.canAddBreak = true;
    }
  }

  deleteBreak(selectedBreak: {startTime: string, endTime: string}){
    this.shiftFormGroup.value.breaks = this.shiftFormGroup.value.breaks?.filter((currentBreak) => {
      return currentBreak !== selectedBreak;
    })
  }

  errorCheck(){
    let updatedShift: Shift = {
      error: false,
      id: this.data.shift.id,
      position: this.shiftFormGroup.value.position!,
      instances: this.shiftFormGroup.value.instances!,
      startTime: this.shiftFormGroup.value.shiftStartTime!,
      endTime: this.shiftFormGroup.value.shiftEndTime!,
      minutes: this.data.shift.minutes,
      breaks: this.shiftFormGroup.value.breaks!,
      everyday: this.shiftFormGroup.value.everyday!,
      mon: this.shiftFormGroup.value.monday!,
      tue: this.shiftFormGroup.value.tuesday!,
      wed: this.shiftFormGroup.value.wednesday!,
      thu: this.shiftFormGroup.value.thursday!,
      fri: this.shiftFormGroup.value.friday!,
      sat: this.shiftFormGroup.value.saturday!,
      sun: this.shiftFormGroup.value.sunday!,
    };

    //Recalculate shift minutes if start and/or end time changed
    if(this.unsavedTimeChanges){

      //If user attempted to add a new break and did not fill out any time fields, delete the break
      if(this.shiftFormGroup.value.breaks![this.shiftFormGroup.value.breaks!.length - 1].startTime === '' || this.shiftFormGroup.value.breaks![this.shiftFormGroup.value.breaks!.length - 1].endTime === ''){
        this.shiftFormGroup.value.breaks?.pop();
      }

      //If user attempted to add a new break and did not fill out all time fields, delete the break
      if(this.shiftFormGroup.value.breaks![this.shiftFormGroup.value.breaks!.length - 1].startTime.length < 5 || this.shiftFormGroup.value.breaks![this.shiftFormGroup.value.breaks!.length - 1].endTime.length < 5){
        this.shiftFormGroup.value.breaks?.pop();
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

      if (this.shiftFormGroup.value.breaks!.length > 0) {

        for (let i = 0; i < this.shiftFormGroup.value.breaks!.length; i++ ) {
          let breakStartHour: number = parseInt(this.shiftFormGroup.value.breaks![i].startTime.substring(0, 2));
          let breakEndHour: number = parseInt(this.shiftFormGroup.value.breaks![i].endTime.substring(0, 2));
          //Check for overnight break logic
          if(breakStartHour >  breakEndHour){
            breakEndHour += 24;
          }

          if(this.shiftFormGroup.value.breaks![i].startTime.length < 5 || this.shiftFormGroup.value.breaks![i].endTime.length < 5){
            console.log('error');
            this.updatedShift.error = true;
            this.errorMessage = 'Please fill out missing break time fields for break ' + (i + 1);
            return false;
          } else if(this.shiftFormGroup.value.breaks![i].startTime === this.shiftFormGroup.value.breaks![i].endTime){
            console.log('error');
            this.updatedShift.error = true;
            this.errorMessage = 'Breaks have to be at least one minute long';
            return false;
          } else if(breakStartHour < parseInt(this.shiftFormGroup.value.shiftStartTime!.substring(0, 2)) || breakEndHour > parseInt(this.shiftFormGroup.value.shiftEndTime!.substring(0, 2))){
            console.log('error');
            this.updatedShift.error = true;
            this.errorMessage = 'Breaks have to be set within the shift start and end time';
            return false;
          }

          for(let j = 0; j < this.shiftFormGroup.value.breaks!.length; j++){
            //If the current break is the user defined break, skip
            if(i === j){
              console.log('continuing');
              continue;
            }

            //Check if current break overlaps the start of user defined break
            if(parseInt(this.shiftFormGroup.value.breaks![j].startTime.substring(0, 2)) < breakStartHour){
              if(parseInt(this.shiftFormGroup.value.breaks![j].endTime.substring(0, 2)) > breakStartHour){
                console.log('error');
                this.updatedShift.error = true;
                this.errorMessage = 'Break ' + (i + 1) + '  will overlap break ' + (j + 1) + ' and therefore cannot be added';
                return false;
              } else if(parseInt(this.shiftFormGroup.value.breaks![j].endTime.substring(0, 2)) === breakStartHour){
                if(parseInt(this.shiftFormGroup.value.breaks![j].endTime.substring(3, 5)) > parseInt(this.shiftFormGroup.value.shiftStartTime!.substring(3, 5))){
                  //If the current break ending hour is the same time as the user defined break starting hour
                  //and the current break time ending minutes is greater than the user defined break starting minutes,
                  //the current break cannot end after the user defined break has already started
                  console.log('error');
                  this.updatedShift.error = true;
                  this.errorMessage = 'Break ' + (i + 1) + '  will overlap break ' + (j + 1) + ' and therefore cannot be added';
                  return false;
                }
              }

            //Check if current break overlaps the end of user defined break
            } else if(parseInt(this.shiftFormGroup.value.breaks![j].endTime.substring(0, 2)) > breakEndHour){
              if(parseInt(this.shiftFormGroup.value.breaks![j].startTime.substring(0, 2)) < breakEndHour){
                //If the current break starting hour is less than the user defined break starting hour,
                //the current break cannot start before the user defined break has ended
                console.log('error');
                this.updatedShift.error = true;
                this.errorMessage = 'Break ' + (i + 1) + '  will overlap break ' + (j + 1) + ' and therefore cannot be added';
                return false;
              } else if(parseInt(this.shiftFormGroup.value.breaks![j].startTime.substring(0, 2)) === breakEndHour){
                if(parseInt(this.shiftFormGroup.value.breaks![j].startTime.substring(3, 5)) < parseInt(this.shiftFormGroup.value.shiftEndTime!.substring(3, 5))){
                  //If the current break starting hour is the same time as the user defined break ending hour
                  //and the current break starting minutes is less than the user defined break ending minutes,
                  //the current break cannot start before the user defined break ends
                  console.log('error');
                  this.updatedShift.error = true;
                  this.errorMessage = 'Break ' + (i + 1) + '  will overlap break ' + (j + 1) + ' and therefore cannot be added';
                  return false;
                }
              }
            } else {
              //The current break cannot start and end during the time of the user defined break
              console.log('error');
              this.updatedShift.error = true;
              this.errorMessage = 'Break ' + (i + 1) + '  will overlap break ' + (j + 1) + ' and therefore cannot be added';
              return false;
            }
          }

          let minutes: number = parseInt(this.shiftFormGroup.value.breaks![i].endTime.substring(3, 5)) - parseInt(this.shiftFormGroup.value.breaks![i].startTime.substring(3, 5));
          totalShiftMinutes -= minutes;
        }
      }
      updatedShift.minutes = totalShiftMinutes;
    }

    this.updatedShift = updatedShift;
    this.data.shift.breaks = this.shiftFormGroup.value.breaks;
    //this.data.shift = updatedShift;
    return true;
  }

  ngOnDestroy(): void {
    if(!this.errorCheck()){
      this.data.setError(this.data.shift.id, this.errorMessage);
    }

    if(this.shiftFormGroup.value.breaks![this.shiftFormGroup.value.breaks!.length - 1].endTime === ''){
      this.shiftFormGroup.value.breaks?.pop();
    }
  }

  update(){
    if(this.errorCheck()){
      this.data.editShift(this.updatedShift);
      this.dialogRef.close();
    }
  }
}
