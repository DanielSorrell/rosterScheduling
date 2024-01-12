import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPositionComponent } from './edit-position.component';

describe('EditPositionComponent', () => {
  let component: EditPositionComponent;
  let fixture: ComponentFixture<EditPositionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditPositionComponent]
    });
    fixture = TestBed.createComponent(EditPositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
