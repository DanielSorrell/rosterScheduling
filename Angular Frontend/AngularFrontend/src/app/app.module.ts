import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {MatSidenavModule} from '@angular/material/sidenav';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EmployeesListComponent } from './components/employees/employees-list/employees-list.component';
import { HttpClientModule } from '@angular/common/http';
import { AddEmployeeComponent } from './components/employees/add-employee/add-employee.component';
import { EmployeeNavComponent } from './components/employees/employee-nav/employee-nav.component';
import { EditEmployeeComponent } from './components/employees/edit-employee/edit-employee.component';
import { CreateScheduleComponent } from './components/schedules/create-schedule/create-schedule.component';
import { ScheduleWizardComponent } from './components/schedules/schedule-wizard/schedule-wizard.component';
import {MatStepperModule} from '@angular/material/stepper';
import {MatDialog, MatDialogRef, MatDialogModule} from '@angular/material/dialog';
import { ColorPickerModule } from 'ngx-color-picker';

import {FormBuilder, Validators, FormGroup, FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import {NgIf, JsonPipe} from '@angular/common';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatRadioModule} from '@angular/material/radio';
import {MatRadioGroup } from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

import { MatInputModule } from '@angular/material/input';
import {MatNativeDateModule} from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import {MatTabsModule} from '@angular/material/tabs';
import { SetShiftBreakDialogComponent } from './components/schedules/schedule-wizard/set-shift-break-dialog/set-shift-break-dialog/set-shift-break-dialog.component';
import { ShiftCreatorComponent } from './components/schedules/schedule-wizard/shift-creator/shift-creator.component';

import {DragDropModule} from '@angular/cdk/drag-drop';
import { FulfillShiftDialogComponent } from './components/schedules/create-schedule/fulfill-shift-dialog/fulfill-shift-dialog.component';
import { PositionFilterComponent } from './components/schedules/create-schedule/position-filter/position-filter.component';
import { ScheduleListComponent } from './components/schedules/schedule-list/schedule-list.component';
import { EditShiftDialogComponent } from './components/schedules/create-schedule/edit-shift-dialog/edit-shift-dialog.component';
import { PositionListComponent } from './components/positions/position-list/position-list.component';
import { EditPositionComponent } from './components/positions/edit-position/edit-position.component';
import { AddPositionComponent } from './components/positions/add-position/add-position.component';
import { DeleteEmployeeDialogComponent } from './components/positions/edit-position/delete-employee-dialog/delete-employee-dialog.component';
import { DeletePositionDialogComponent } from './components/positions/edit-position/delete-position-dialog/delete-position-dialog.component';
import { SavedSchedulesComponent } from './components/schedules/saved-schedules/saved-schedules.component';
import { HomeComponent } from './components/home/home.component';
import { NotesDialogComponent } from './components/schedules/create-schedule/notes-dialog/notes-dialog.component';
import { UpdateShiftDialogComponent } from './components/schedules/schedule-wizard/update-shift-dialog/update-shift-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    EmployeesListComponent,
    AddEmployeeComponent,
    EmployeeNavComponent,
    EditEmployeeComponent,
    CreateScheduleComponent,
    ScheduleWizardComponent,
    SetShiftBreakDialogComponent,
    ShiftCreatorComponent,
    FulfillShiftDialogComponent,
    PositionFilterComponent,
    ScheduleListComponent,
    EditShiftDialogComponent,
    PositionListComponent,
    EditPositionComponent,
    AddPositionComponent,
    DeleteEmployeeDialogComponent,
    DeletePositionDialogComponent,
    SavedSchedulesComponent,
    HomeComponent,
    NotesDialogComponent,
    UpdateShiftDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    JsonPipe,
    MatNativeDateModule,
    BrowserAnimationsModule,
    MatTabsModule,
    MatSidenavModule,
    MatStepperModule,
    MatButtonModule,
    MatDialogModule,
    DragDropModule,
    MatExpansionModule,
    MatRadioModule,
    MatSelectModule,
    MatCheckboxModule,
    ColorPickerModule,
    MatProgressSpinnerModule,
  ],
  exports: [
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    MatSidenavModule,
    MatStepperModule,
    FormsModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatExpansionModule,
    MatRadioModule,
    MatSelectModule,
    MatCheckboxModule,
    ColorPickerModule,
    MatProgressSpinnerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
