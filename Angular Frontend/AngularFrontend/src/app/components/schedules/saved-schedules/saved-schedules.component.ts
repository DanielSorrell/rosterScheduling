import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SavedSchedule } from 'src/app/models/savedSchedule.model';
import { ScheduleService } from 'src/app/services/schedule.service';
@Component({
  selector: 'app-saved-schedules',
  templateUrl: './saved-schedules.component.html',
  styleUrls: ['./saved-schedules.component.css']
})
export class SavedSchedulesComponent {
  constructor(private scheduleService: ScheduleService, private router: Router) {}

  savedSchedules: SavedSchedule[] = [];

  ngOnInit(): void {
    this.savedSchedules = this.scheduleService.getSavedSchedules();
  }

  openSchedule(schedule: SavedSchedule) {
    this,this.scheduleService.openSavedSchedule(schedule);
    this.router.navigate(['schedule/edit']);
  }
}
