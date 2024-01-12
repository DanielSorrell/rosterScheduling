import { Component, OnInit } from '@angular/core';
import { EmployeesService } from '../../../services/employees.service';
import { Position } from 'src/app/models/position.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-position-list',
  templateUrl: './position-list.component.html',
  styleUrls: ['./position-list.component.css']
})
export class PositionListComponent {
  constructor(private router: Router, private employeesService: EmployeesService) {}
  isLoading: boolean = true;
  positions: {position: Position, empCount: number}[] = [];
  employeesByPositions: Map<string, Set<string>> = new Map();
  error: boolean = false;
  errorMessage: string = '';

  ngOnInit(): void {
    this.employeesService.getAllPositions()
    .subscribe({
      next: (positionList) => {
        for(let position of positionList){
          this.employeesService.findEmployeesByQualifiedPosition(position.title)
          .subscribe({
            next: (employees) => {
              this.positions.push({position: position, empCount: employees.length});
            }
          });
        }
        this.isLoading = false;
        //this.positions = positions;
      },
      error: (response) => {
        this.error = true;
        this.errorMessage = 'Error retrieving positions';
        this.isLoading = false;
      }
    });

  }

  updatePosition(title: string){
    this.router.navigate(['position/update/' + title]);
  }

  closeErrorMessage() {
    this.error = false;
  }
}
