import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletePositionDialogComponent } from './delete-position-dialog.component';

describe('DeletePositionDialogComponent', () => {
  let component: DeletePositionDialogComponent;
  let fixture: ComponentFixture<DeletePositionDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeletePositionDialogComponent]
    });
    fixture = TestBed.createComponent(DeletePositionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
