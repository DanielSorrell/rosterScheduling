import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedSchedulesComponent } from './saved-schedules.component';

describe('SavedSchedulesComponent', () => {
  let component: SavedSchedulesComponent;
  let fixture: ComponentFixture<SavedSchedulesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SavedSchedulesComponent]
    });
    fixture = TestBed.createComponent(SavedSchedulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
