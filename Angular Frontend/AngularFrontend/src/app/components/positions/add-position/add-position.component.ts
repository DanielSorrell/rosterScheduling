import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Position } from 'src/app/models/position.model';
import { Employee } from 'src/app/models/employee.model';
import { EmployeesService } from 'src/app/services/employees.service';

@Component({
  selector: 'app-add-position',
  templateUrl: './add-position.component.html',
  styleUrls: ['./add-position.component.css']
})
export class AddPositionComponent {
  constructor(private route: ActivatedRoute, private employeeService: EmployeesService, private router: Router) {}

  isLoading: boolean = true;
  unsavedChanges: boolean = false;
  positionDetails: Position = {
    id: '00000000-0000-0000-0000-000000000000',
    employeeID: '',
    title: '',
    rate: 0,
  };
  employees: Map<string, Employee> = new Map();
  filteredEmployees: {employee: string, selected: boolean}[] = [];
  selectedEmployees: {employee: string, selected: boolean}[] = [];
  searchEmployeesValue: string = '';
  error: boolean = false;
  errorMessage: string = '';
  unavailablePositionTitles: Set<string> = new Set();

  ngOnInit(): void {
    this.employeeService.getAllEmployees()
    .subscribe({
      next: (employees) => {
        for(let employee of employees){
          this.employees.set(employee.id, employee);
          this.filteredEmployees.push({employee: employee.id, selected: false});
        }
      }, error: (error) => {
        this.error = true;
        this.errorMessage = 'Error retrieving employees';
      }
    });

    this.employeeService.getAllPositions()
    .subscribe({
      next: (positions) => {
        for(let position of positions){
          this.unavailablePositionTitles.add(position.title);
        }
      },
      error: (error) => {
        this.error = true;
        this.errorMessage = 'Error checking for unique position titles';
      }
    });

    this.isLoading = false;
  }

  closeErrorMessage() {
    this.error = false;
  }

  searchEmployees() {
    let matchingEmployees = [];
    let searchValue = this.searchEmployeesValue.toLowerCase();
    if(this.searchEmployeesValue !== ''){
      for(let employee of this.employees){
        if(employee[1].preferredName.toLowerCase().includes(this.searchEmployeesValue) || employee[1].lastName.toLowerCase().includes(this.searchEmployeesValue)){
          matchingEmployees.push({employee: employee[1].id, selected: false});
        }
      }
    } else {
      for(let employee of this.employees){
        matchingEmployees.push({employee: employee[1].id, selected: false});
      }
    }
    this.filteredEmployees = matchingEmployees;
  }

  selectEmployee(employeeID: string) {
    this.filteredEmployees = this.filteredEmployees.filter((employee) => {
      return employee.employee !== employeeID
    });
    this.selectedEmployees.push({employee: employeeID, selected: true});
  }

  unselectEmployee(employeeID: string) {
    this.selectedEmployees = this.selectedEmployees.filter((employee) => {
      return employee.employee !== employeeID
    });
    this.filteredEmployees.push({employee: employeeID, selected: false});
  }

  submit() {
    if(this.unavailablePositionTitles.has(this.positionDetails.title)){
      this.error = true;
      this.errorMessage = 'Position title: ' + this.positionDetails.title + ' is already taken';
      return;
    }

    if(this.positionDetails.title === '' || this.positionDetails.rate === 0){
      this.error = true;
      this.errorMessage = 'Required fields cannot be left blank';
      return;
    }

    for(let employee of this.selectedEmployees){
      let currentPosition: Position = {
        id: '00000000-0000-0000-0000-000000000000',
        employeeID: employee.employee,
        title: this.positionDetails.title,
        rate: this.positionDetails.rate,
      };
      this.employeeService.addPosition(currentPosition).subscribe();
    }
    this.router.navigate(['position/view']);
  }
}
