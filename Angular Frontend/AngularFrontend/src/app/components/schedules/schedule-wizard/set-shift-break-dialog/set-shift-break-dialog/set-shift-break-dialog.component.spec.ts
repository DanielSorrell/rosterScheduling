import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetShiftBreakDialogComponent } from './set-shift-break-dialog.component';

describe('SetShiftBreakDialogComponent', () => {
  let component: SetShiftBreakDialogComponent;
  let fixture: ComponentFixture<SetShiftBreakDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SetShiftBreakDialogComponent]
    });
    fixture = TestBed.createComponent(SetShiftBreakDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
