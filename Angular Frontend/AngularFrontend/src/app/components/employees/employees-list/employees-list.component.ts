import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { Employee } from 'src/app/models/employee.model';
import { Position } from 'src/app/models/position.model';
import { EmployeesService } from '../../../services/employees.service';

@Component({
  selector: 'app-employees-list',
  templateUrl: './employees-list.component.html',
  styleUrls: ['./employees-list.component.css']
})
export class EmployeesListComponent implements OnInit {
  constructor(private router: Router, private employeesService: EmployeesService) {}

  isLoading: boolean = true;
  employees: Employee[] = [];
  employeePositions: Map<string, Position[]> = new Map();
  notification: boolean = false;
  notificationMessage: string = 'ssggsg';
  error: boolean = false;
  errorMessages: Set<string> = new Set();

  ngOnInit(): void {
    this.employeesService.getAllEmployees()
    .subscribe({
      next: (employees) => {
        this.employees = employees;

        for(let employee of employees){
          this.employeesService.getEmployeePositions(employee.id)
          .subscribe({
            next: (positions) => {
              this.employeePositions.set(employee.id, positions);
            },
            error: (error) => {
              this.error = true;
              let errorMessage = 'Error finding positions for: ' + employee.preferredName + ', ' + employee.lastName;
              this.errorMessages.add(errorMessage);
              this.isLoading = false;
            }
          });
        }

        this.isLoading = false;
      },
      error: (error) => {
        this.error = true;
        let errorMessage = 'Error retrieving employees';
        this.errorMessages.add(errorMessage);
        this.isLoading = false;
      }
    });

    if(this.employeesService.getNotification() !== ''){
      this.notification = true;
      this.notificationMessage = this.employeesService.getNotification();
    }
  }

  updateEmployee(id: string){
    this.router.navigate(['employees/update/' + id]);
  }

  closeNotification() {
    this.employeesService.closeNotification();
    this.notification = false;
  }

  closeErrorMessage(error: string){
    this.errorMessages.delete(error);
    if(this.errorMessages.size == 0){
      this.error = false;
    }
  }
}
