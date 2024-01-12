import { Component } from '@angular/core';
import {FormGroup, FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgIf, JsonPipe} from '@angular/common';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatNativeDateModule} from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { SetShiftBreakDialogComponent } from './components/schedules/schedule-wizard/set-shift-break-dialog/set-shift-break-dialog/set-shift-break-dialog.component';
import { ScheduleService } from './services/schedule.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  template: `
    <context name="FamilyContext">
      <provider name="ScheduleContext" [value]="ScheduleContextValue">
        <app-grandchild> </app-grandchild>
      </provider>
    </context>
`
})
export class AppComponent {
  constructor(private scheduleService: ScheduleService) { }
  title = 'Roster Scheduling';

  ngOnDestroy(): void {
    this.scheduleService.resetSchedules();
  }

}
