import {Component, OnInit} from '@angular/core';
import { firstValueFrom} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {Router} from '@angular/router';
import {EmployeesService} from 'src/app/services/employees.service';
import {Employee} from 'src/app/models/employee.model';
import {Position} from 'src/app/models/position.model';

@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.css']
})
export class EditEmployeeComponent implements OnInit {
  constructor(private route: ActivatedRoute, private employeeService: EmployeesService, private router: Router) {}

  isLoading: boolean = true;
  unsavedChanges: boolean = false;
  currentPositions: Map<string, Position> = new Map();
  positions: {title: string, rate: number, selected: boolean}[] = [];
  employeeDetails: Employee = {
    id: '',
    positions: [],
    preferredName: '',
    firstName: '',
    lastName: '',
    address: '',
    numOfAvailDaysAWeek: 0,
    everydayAvailability: false,
    mondayAvailability : false,
    tuesdayAvailability : false,
    wednesdayAvailability : false,
    thursdayAvailability : false,
    fridayAvailability : false,
    saturdayAvailability : false,
    sundayAvailability : false
  };
  id: string = '';
  error: boolean = false;
  errorMessage: string = '';

  ngOnInit(): void {
    this.route.paramMap
    .subscribe({
      next: (params) => {
        this.id = params.get('id')!;
        if(this.id){
          this.employeeService.getEmployee(this.id)
          .subscribe({
            next: (response) => {
              this.employeeDetails = response;
            },
            error: (error) => {
              this.error = true;
              this.errorMessage = 'Error finding employee';
            }
          });
        }
      },
      error: (error) => {
        this.error = true;
        this.errorMessage = 'Error finding employee';
      }
    });



    this.employeeService.getEmployeePositions(this.id)
    .subscribe({
      next: (positions) => {
        for(let position of positions){
          this.currentPositions.set(position.title, position);
        }
        console.log(positions);

        this.employeeService.getAllPositions()
        .subscribe({
          next: (positions) => {
            for(let position of positions){
              let selected: boolean = false;
              if(this.currentPositions.has(position.title)){
                selected = true;
              }
              this.positions.push({title: position.title, rate: position.rate, selected: selected});
            }
          },
          error: (response) => {
            this.error = true;
            this.errorMessage = 'Error loading positions to assign to the employee';
          }
        });

      },
      error: (error) => {
        this.error = true;
        this.errorMessage = 'Error finding employee positions';
      }
    });
    this.isLoading = false;
  }

  async updateEmployee() {
    //Check for missing required fields
    if(this.employeeDetails.firstName === '' ||
      this.employeeDetails.lastName === '' ||
      this.employeeDetails.address === ''
    ){
      this.error = true;
      this.errorMessage = 'Please fill out remaining required fields';
      return;
    }

    if(this.employeeDetails.preferredName === ''){
      this.employeeDetails.preferredName = this.employeeDetails.firstName;
    }

    for(let position of this.positions){

      if(this.currentPositions.has(position.title) && !position.selected){
        await firstValueFrom(this.employeeService.deleteEmployeePosition(this.currentPositions.get(position.title)!));
      } else if(!this.currentPositions.has(position.title) && position.selected){
        let newPosition: Position = {
          id: '',
          employeeID: this.employeeDetails.id,
          title: position.title,
          rate: position.rate,
        };
        await firstValueFrom(this.employeeService.addPosition(newPosition));
      }
    }

    this.employeeService.setNotification(this.employeeDetails.preferredName + ', ' + this.employeeDetails.lastName + ' has been updated.');
    this.employeeService.updateEmployee(this.employeeDetails.id, this.employeeDetails)
    .subscribe({
      next: (response) => {
        this.router.navigate(['employees/view']);
      },
      error: (error) => {
        this.error = true;
        this.errorMessage = 'Error updating employee';
      }
    });
  }

  deletePosition(position: Position) {
    this.employeeService.deleteEmployeePosition(position)
    .subscribe({
      next: (deletedPosition) => {
        for(let currentPosition of this.positions){
          if(currentPosition.title === position.title){
            currentPosition.selected = false;
          }
        }
      },
      error: (error) => {
        this.error = true;
        this.errorMessage = 'Error deleting position: ' + position.title;
      }
    });
  }

  addPosition(){
    this.router.navigate(['position/view']);
  }

  deleteEmployee(employeeID: string) {
    this.employeeService.deleteEmployee(employeeID)
    .subscribe({
      next: (response) => {
        this.employeeService.setNotification(this.employeeDetails.preferredName + ', ' + this.employeeDetails.lastName + ' has been removed.');
        this.router.navigate(['employees/view']);
      },
      error: (error) => {
        console.log(error);
        this.error = true;
        this.errorMessage = 'Error deleting employee';
      }
    });
  }

  cancel(){
    this.router.navigate(['employees/view']);
  }

  setUnsavedChanges() {
    if(!this.unsavedChanges){
      this.unsavedChanges = true;
    }
  }

  closeErrorMessage() {
    this.error = false;
  }
}
