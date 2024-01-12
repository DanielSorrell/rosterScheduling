import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FulfillShiftDialogComponent } from './fulfill-shift-dialog.component';

describe('FulfillShiftDialogComponent', () => {
  let component: FulfillShiftDialogComponent;
  let fixture: ComponentFixture<FulfillShiftDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FulfillShiftDialogComponent]
    });
    fixture = TestBed.createComponent(FulfillShiftDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
