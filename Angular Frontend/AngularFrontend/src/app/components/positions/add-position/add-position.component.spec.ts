import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPositionComponent } from './add-position.component';

describe('AddPositionComponent', () => {
  let component: AddPositionComponent;
  let fixture: ComponentFixture<AddPositionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddPositionComponent]
    });
    fixture = TestBed.createComponent(AddPositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
