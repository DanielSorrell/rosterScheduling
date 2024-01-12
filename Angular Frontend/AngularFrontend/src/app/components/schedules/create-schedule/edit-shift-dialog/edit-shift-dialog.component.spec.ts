import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditShiftDialogComponent } from './edit-shift-dialog.component';

describe('EditShiftDialogComponent', () => {
  let component: EditShiftDialogComponent;
  let fixture: ComponentFixture<EditShiftDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditShiftDialogComponent]
    });
    fixture = TestBed.createComponent(EditShiftDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
