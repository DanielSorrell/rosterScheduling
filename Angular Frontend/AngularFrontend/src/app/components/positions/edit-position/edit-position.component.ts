import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Position } from 'src/app/models/position.model';
import { Employee } from 'src/app/models/employee.model';
import { EmployeesService } from 'src/app/services/employees.service';
import { DeleteEmployeeDialogComponent } from './delete-employee-dialog/delete-employee-dialog.component';
import { DeletePositionDialogComponent } from './delete-position-dialog/delete-position-dialog.component';
import { MatDialog, MatDialogRef, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-position',
  templateUrl: './edit-position.component.html',
  styleUrls: ['./edit-position.component.css']
})
export class EditPositionComponent {
  constructor(private route: ActivatedRoute, private employeeService: EmployeesService, private router: Router, public dialog: MatDialog) {}

  isLoading: boolean = true;
  unsavedChanges: boolean = false;
  search: string = '';
  originalTitle: string = '';
  positionDetails: Position = {
    id: '',
    employeeID: '',
    title: '',
    rate: 0,
  };
  allEmployees: Map<string, Employee> = new Map();
  qualifiedEmployees: Employee[] = [];
  newQualifiedEmployees: {employee: string, selected: boolean}[] = [];
  unqualifiedEmployees: {employee: string, selected: boolean}[] = [];
  filteredUnqualifiedEmployees: {employee: string, selected: boolean}[] = [];
  searchEmployeesValue: string = '';
  unavailablePositionTitles: Set<string> = new Set();
  error: boolean = false;
  errorMessages: Set<string> = new Set();

  ngOnInit(): void {
    this.employeeService.getAllEmployees().subscribe({
      next: (employees) => {
        for(let employee of employees){
          this.allEmployees.set(employee.id, employee);
        }
      },
      error: (error) => {
        if(!this.error){
          this.error = true;
        }
        this.errorMessages.add('Error retrieving unqualified employees');
      }
    });

    this.route.paramMap.subscribe({
      next: (params) => {
        const currentPositionTitle = params.get('title');
        this.employeeService.getPosition(currentPositionTitle!)
        .subscribe({
          next: (position) => {
            this.positionDetails = position;
            this.originalTitle = position.title;

            this.employeeService.findEmployeesByQualifiedPosition(this.positionDetails.title)
            .subscribe({
              next: (qualifiedEmployees) => {
                this.qualifiedEmployees = qualifiedEmployees;
                this.employeeService.getAllEmployees()
                .subscribe({
                  next: (employees) => {
                    let unqualifiedEmployeesSet = new Set<string>();
                    for(let employee of employees){
                      this.allEmployees.set(employee.id, employee);
                      unqualifiedEmployeesSet.add(employee.id);
                    }

                    for(let employee of this.qualifiedEmployees){
                      if(unqualifiedEmployeesSet.has(employee.id)){
                        unqualifiedEmployeesSet.delete(employee.id);
                      }
                    }

                    for(let employee of unqualifiedEmployeesSet){
                      this.unqualifiedEmployees.push({employee: employee, selected: false});
                    }

                    this.filteredUnqualifiedEmployees = this.unqualifiedEmployees;
                  },
                  error: (error) => {
                    if(!this.error){
                      this.error = true;
                    }
                    this.errorMessages.add('Error retrieving qualified employees');
                  }
                });
              },
              error: (error) => {
                if(!this.error){
                  this.error = true;
                }
                this.errorMessages.add('Error retrieving all employees');
              }
            });
          },
          error: (error) => {
            if(!this.error){
              this.error = true;
            }
            this.errorMessages.add('Error retrieving position details');
          }
        });
      },
      error: (error) => {
        if(!this.error){
          this.error = true;
        }
        this.errorMessages.add('Error retrieving position title to get details');
      }
    });

    this.employeeService.getAllPositions()
    .subscribe({
      next: (positions) => {
        for(let position of positions){
          if(position.title !== this.positionDetails.title){
            this.unavailablePositionTitles.add(position.title);
          }
        }
      },
      error: (error) => {
        if(!this.error){
          this.error = true;
        }
        this.errorMessages.add('Error checking for unique position titles');
      }
    });

    this.isLoading = false;
  }

  searchEmployees() {
    let matchingEmployees = [];
    let searchValue = this.searchEmployeesValue.toLowerCase();
    if(this.searchEmployeesValue !== ''){
      for(let employee of this.unqualifiedEmployees){
        if(this.allEmployees.get(employee.employee)!.preferredName.toLowerCase().includes(this.searchEmployeesValue) || this.allEmployees.get(employee.employee)!.lastName.toLowerCase().includes(this.searchEmployeesValue)){
          if(!employee.selected){
            matchingEmployees.push(employee);
          }
        }
      }
    } else {
      for(let employee of this.unqualifiedEmployees){
        if(!employee.selected){
          matchingEmployees.push(employee);
        }
      }
    }
    console.log(matchingEmployees);
    this.filteredUnqualifiedEmployees = matchingEmployees;
  }

  closeErrorMessage(error: string) {
    this.errorMessages.delete(error);
    if(this.errorMessages.size === 0){
      this.error = false;
    }
  }

  addNewEmployee(employee: string){
    if(!this.unsavedChanges){
      this.unsavedChanges = true;
    }
    this.newQualifiedEmployees.push({employee: employee, selected: true});
    this.filteredUnqualifiedEmployees = this.filteredUnqualifiedEmployees.filter((currentEmployee) => {
      return currentEmployee.employee !== employee
    });
  }

  deleteEmployeeFromNewList(employee: string){
    if(!this.unsavedChanges){
      this.unsavedChanges = true;
    }
    this.filteredUnqualifiedEmployees.push({employee: employee, selected: false});
    this.newQualifiedEmployees = this.newQualifiedEmployees.filter((currentEmployee) => {
      return currentEmployee.employee !== employee
    });
  }

  deleteEmployee(employee: Employee) {
    let positionedEmployee: Position = {
      id: this.positionDetails.id,
      employeeID: employee.id,
      title: this.positionDetails.title,
      rate: this.positionDetails.rate,
    };
    this.employeeService.deleteEmployeePosition(positionedEmployee)
    .subscribe({
      next: (position) => {
        this.qualifiedEmployees = this.qualifiedEmployees.filter((employee) => {
          return position.employeeID !== employee.id
        });
        this.unqualifiedEmployees.push({employee: employee.id, selected: false});
      },
      error: (error) => {
        if(!this.error){
          this.error = true;
        }
        this.errorMessages.add('Error deleting ' + employee.preferredName + ', ' + employee.lastName + ' from this position');
      }
    });
  }

  openDeleteEmployeeDialog(employee: Employee){
    this.dialog.open(DeleteEmployeeDialogComponent, {
      data: {
        employee: employee,
        position: this.positionDetails.title,
        deleteEmployee: (employee: Employee) => {
          this.deleteEmployee(employee);
        }
      }
    });
  }

  deletePosition() {
    this.employeeService.deletePosition(this.positionDetails.title)
    .subscribe({
      next: (position) => {
        this.router.navigate(['position/view']);
      },
      error: (error) => {
        if(!this.error){
          this.error = true;
        }
        this.errorMessages.add('Error deleting position');
      }
    });
  }

  cancel() {
    this.router.navigate(['position/view']);
  }

  openDeletePositionDialog(){
    this.dialog.open(DeletePositionDialogComponent, {
      data: {
        position: this.positionDetails.title,
        deletePosition: (position: string) => {
          this.deletePosition();
        }
      }
    });
  }

  setUnsavedChanges() {
    if(!this.unsavedChanges){
      this.unsavedChanges = true;
    }
  }

  updatePosition() {
    if(this.unavailablePositionTitles.has(this.positionDetails.title)){
      if(!this.error){
        this.error = true;
      }
      this.errorMessages.add('Position title: ' + this.positionDetails.title + ' is already taken');
      return;
    }

    if(this.positionDetails.title === '' ||
    this.positionDetails.rate === 0 ||
    this.positionDetails.rate === null)
    {
      if(!this.error){
        this.error = true;
      }
      this.errorMessages.add('Please fill out missing required fields');
    }

    for(let employee of this.newQualifiedEmployees){
      let newPositionEmployee: Position = {
        id: '00000000-0000-0000-0000-000000000000',
        employeeID: employee.employee,
        title: this.positionDetails.title,
        rate: this.positionDetails.rate,
      };
      this.employeeService.addPosition(newPositionEmployee)
      .subscribe({
        error: (error) => {
          if(!this.error){
            this.error = true;
          }
          this.errorMessages.add('Error checking for unique position titles');
        }
      })
    }

    this.employeeService.updatePosition(this.originalTitle, this.positionDetails)
    .subscribe({
      next: (position) => {
        this.router.navigate(['position/view']);
      },
      error: (error) => {
        if(!this.error){
          this.error = true;
        }
        this.errorMessages.add('Error updating position');
      }
    });
  }
}
