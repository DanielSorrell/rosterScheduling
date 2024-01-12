import {Component} from '@angular/core';
import {Employee} from 'src/app/models/employee.model';
import {EmployeesService} from 'src/app/services/employees.service';
import {Router} from '@angular/router';
import {FormBuilder, Validators, FormGroup, FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatSidenavModule} from '@angular/material/sidenav';
import {NgIf, JsonPipe} from '@angular/common';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatNativeDateModule} from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import {MatTabsModule} from '@angular/material/tabs';
import { AddEmployee } from 'src/app/models/addEmployee.model';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css']
})
export class AddEmployeeComponent {
  constructor(private employeeService: EmployeesService, private router: Router, private _formBuilder: FormBuilder) {}

  positions: {title: string, selected: boolean}[] = [];
  addEmployeeRequest: Employee = {
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
    sundayAvailability: false
  };
  error: boolean = false;
  errorMessage: string = '';
  noAvailabilitySelected: boolean = false;

  ngOnInit(): void {
    this.employeeService.getAllPositions()
    .subscribe({
      next: (positions) => {
        for(let position of positions){
          this.positions.push({title: position.title, selected: false});
        }
      },
      error: (response) => {
        this.error = true;
        this.errorMessage = 'Error loading positions to assign to the employee';
      }
    });
  }

  addEmployee() {
    if(this.addEmployeeRequest.firstName === '' ||
      this.addEmployeeRequest.lastName === '' ||
      this.addEmployeeRequest.address === '')
    {
      this.error = true;
      this.errorMessage = 'Required fields cannot be left blank';
      return;
    }

    let noPositionsSelected = false;
    for(let position of this.positions){
      if(position.selected){
        noPositionsSelected = true;
      }
    }
    if(!noPositionsSelected){
      this.error = true;
      this.errorMessage = 'New employees require at least 1 position';
      return;
    }

    if(this.addEmployeeRequest.everydayAvailability == false &&
      this.addEmployeeRequest.mondayAvailability == false &&
      this.addEmployeeRequest.tuesdayAvailability == false &&
      this.addEmployeeRequest.wednesdayAvailability == false &&
      this.addEmployeeRequest.thursdayAvailability == false &&
      this.addEmployeeRequest.fridayAvailability == false &&
      this.addEmployeeRequest.saturdayAvailability == false &&
      this.addEmployeeRequest.sundayAvailability == false)
    {
      this.error = true;
      this.errorMessage = 'New employees require at least 1 day of availability';
      return;
    }

    if(this.addEmployeeRequest.preferredName === ''){
      this.addEmployeeRequest.preferredName = this.addEmployeeRequest.firstName;
    }

    let selectedPositions: string[] = [];
    for(let position of this.positions){
      if(position.selected){
        selectedPositions.push(position.title);
      }
    }

    //Count number of available days a week
    if(this.addEmployeeRequest.everydayAvailability){
      this.addEmployeeRequest.numOfAvailDaysAWeek = 7;
    } else {
      this.addEmployeeRequest.numOfAvailDaysAWeek = 0;
      if(this.addEmployeeRequest.mondayAvailability){
        this.addEmployeeRequest.numOfAvailDaysAWeek++;
      }
      if(this.addEmployeeRequest.tuesdayAvailability){
        this.addEmployeeRequest.numOfAvailDaysAWeek++;
      }
      if(this.addEmployeeRequest.wednesdayAvailability){
        this.addEmployeeRequest.numOfAvailDaysAWeek++;
      }
      if(this.addEmployeeRequest.thursdayAvailability){
        this.addEmployeeRequest.numOfAvailDaysAWeek++;
      }
      if(this.addEmployeeRequest.fridayAvailability){
        this.addEmployeeRequest.numOfAvailDaysAWeek++;
      }
      if(this.addEmployeeRequest.saturdayAvailability){
        this.addEmployeeRequest.numOfAvailDaysAWeek++;
      }
      if(this.addEmployeeRequest.sundayAvailability){
        this.addEmployeeRequest.numOfAvailDaysAWeek++;
      }
    }

    let newEmployee: AddEmployee = {
      id: '00000000-0000-0000-0000-000000000000',
      preferredName: this.addEmployeeRequest.preferredName,
      firstName: this.addEmployeeRequest.firstName,
      lastName: this.addEmployeeRequest.lastName,
      address: this.addEmployeeRequest.address,
      numOfAvailDaysAWeek: this.addEmployeeRequest.numOfAvailDaysAWeek,
      everydayAvailability: this.addEmployeeRequest.everydayAvailability,
      mondayAvailability: this.addEmployeeRequest.mondayAvailability,
      tuesdayAvailability: this.addEmployeeRequest.tuesdayAvailability,
      wednesdayAvailability: this.addEmployeeRequest.wednesdayAvailability,
      thursdayAvailability: this.addEmployeeRequest.thursdayAvailability,
      fridayAvailability: this.addEmployeeRequest.fridayAvailability,
      saturdayAvailability: this.addEmployeeRequest.saturdayAvailability,
      sundayAvailability: this.addEmployeeRequest.sundayAvailability,
    };

    this.employeeService.addEmployee(newEmployee, selectedPositions)
    .subscribe({
      next: (response) => {
        this.employeeService.setNotification(this.addEmployeeRequest.preferredName + ', ' + this.addEmployeeRequest.lastName + ' has been added.');
        this.router.navigate(['employees/view']);
      },
      error: (error) => {
        this.error = true;
        this.errorMessage = 'Error adding employee. Please try again later';
      }
    });

  }

  closeErrorMessage() {
    this.error = false;
  }
}
