import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotesDialogComponent } from './notes-dialog.component';

describe('NotesDialogComponent', () => {
  let component: NotesDialogComponent;
  let fixture: ComponentFixture<NotesDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NotesDialogComponent]
    });
    fixture = TestBed.createComponent(NotesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
