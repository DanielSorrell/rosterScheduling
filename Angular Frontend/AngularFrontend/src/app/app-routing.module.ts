import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {FormGroup, FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgIf, JsonPipe} from '@angular/common';
import { EmployeeNavComponent } from './components/employees/employee-nav/employee-nav.component';
import { EmployeesListComponent } from './components/employees/employees-list/employees-list.component';
import { AddEmployeeComponent } from './components/employees/add-employee/add-employee.component';
import { EditEmployeeComponent } from './components/employees/edit-employee/edit-employee.component';
import { CreateScheduleComponent } from './components/schedules/create-schedule/create-schedule.component';
import { ScheduleWizardComponent } from './components/schedules/schedule-wizard/schedule-wizard.component';
import { ScheduleListComponent } from './components/schedules/schedule-list/schedule-list.component';
import { SavedSchedulesComponent } from './components/schedules/saved-schedules/saved-schedules.component';
import { PositionListComponent } from './components/positions/position-list/position-list.component';
import { EditPositionComponent } from './components/positions/edit-position/edit-position.component';
import { AddPositionComponent } from './components/positions/add-position/add-position.component';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [

  {
    path: 'employees/view',
    component: EmployeesListComponent
  },
  {
    path: 'employees/add',
    component: AddEmployeeComponent
  },
  {
    path: 'employees/update/:id',
    component: EditEmployeeComponent
  },
  {
    path: 'position/view',
    component: PositionListComponent
  },
  {
    path: 'position/add',
    component: AddPositionComponent
  },
  {
    path: 'position/update/:title',
    component: EditPositionComponent
  },
  {
    path: 'schedules/create',
    component: ScheduleWizardComponent
  },
  {
    path: 'schedule/edit',
    component: CreateScheduleComponent
  },
  {
    path: 'schedules/view',
    component: ScheduleListComponent
  },
  {
    path: 'schedules/viewSaved',
    component: SavedSchedulesComponent
  },
  {
    path: '',
    component: HomeComponent
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    JsonPipe,
    MatNativeDateModule,
  ],
  exports: [
    RouterModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    JsonPipe,
    MatNativeDateModule,
  ]
})
export class AppRoutingModule { }
