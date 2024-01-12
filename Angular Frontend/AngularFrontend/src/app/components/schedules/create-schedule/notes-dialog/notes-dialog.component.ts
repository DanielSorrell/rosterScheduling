import { Component, Inject, Input } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-notes-dialog',
  templateUrl: './notes-dialog.component.html',
  styleUrls: ['./notes-dialog.component.css']
})
export class NotesDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
  notes: string = '';

  ngOnInit(): void {
    if(this.data.notes !== ''){
      this.notes = this.data.notes;
    }
  }

  updateNotes(){
    this.data.updateNotes(this.notes);
  }
}
