import { Component, Inject, Input } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-delete-employee-dialog',
  templateUrl: './delete-employee-dialog.component.html',
  styleUrls: ['./delete-employee-dialog.component.css']
})
export class DeleteEmployeeDialogComponent {
  constructor( @Inject(MAT_DIALOG_DATA) public data: any) { }

  removeEmployee() {
    this.data.deleteEmployee(this.data.employee);
  }
}
