import { Component, Input, ComponentRef, Output, EventEmitter } from '@angular/core';
import { ScheduleWizardComponent } from '../schedule-wizard.component';
import { UpdateShiftDialogComponent } from '../update-shift-dialog/update-shift-dialog.component';
import {MatDialog, MatDialogRef, MatDialogModule} from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { Shift } from 'src/app/models/shift.model';

@Component({
  selector: 'app-shift-creator',
  templateUrl: './shift-creator.component.html',
  styleUrls: ['./shift-creator.component.css']
})
export class ShiftCreatorComponent {
  constructor(public dialog: MatDialog) {}

  @Input() shift: any;
  @Input() index: any;
  @Input() positions: any;
  @Output() delete = new EventEmitter<any>();
  @Output() edit = new EventEmitter<any>();
  @Output() setError = new EventEmitter<any>();
  error: boolean = false;
  errorMessage: string = '';

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

  openEditShiftDialog(): void{
    this.dialog.open(UpdateShiftDialogComponent, {
      data: {
        shift: this.shift,
        positions: this.positions,
        editShift: (shift: Shift) => {
          console.log(shift);
          this.edit.emit(shift);
        },
        setError: (shiftId: string, errorMessage: string) => {
          this.setError.emit(shiftId);
          this.error = true;
          this.errorMessage = errorMessage;
        },
        errorMessage: this.errorMessage
      },
      width: '1000px',
    });
  }

  deleteShift() {
    this.delete.emit();
  }
}
