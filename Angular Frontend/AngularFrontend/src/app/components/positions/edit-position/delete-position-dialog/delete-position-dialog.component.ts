import { Component, Inject, Input } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-delete-position-dialog',
  templateUrl: './delete-position-dialog.component.html',
  styleUrls: ['./delete-position-dialog.component.css']
})
export class DeletePositionDialogComponent {
  constructor( @Inject(MAT_DIALOG_DATA) public data: any) { }

  deletePosition() {
    this.data.deletePosition(this.data.position);
  }
}
