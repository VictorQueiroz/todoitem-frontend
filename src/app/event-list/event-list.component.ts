import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { EventListService, IEvent } from './event-list.service';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss'],
})
export class EventListComponent implements OnInit {
  public events = new Array<IEvent>();

  constructor(private readonly eventListService: EventListService) {}

  public ngOnInit(): void {
    this.eventListService.getEvents().subscribe((events) => {
      this.events = events;
    });
  }

  public formatEvent(event: IEvent): string {
    switch (event.EventType) {
      case 'create':
        return `<b>${event.EventTime}</b>: Task <b>#${event.TaskId}</b> was created and assigned to user <b>${event.AssignedUser || 'Unassigned'}</b>`;
      case 'notified':
        return `<b>${event.EventTime}</b>: Task <b>#${event.TaskId}</b> was notified to user <b>${event.AssignedUser || 'Unassigned'}`;
      default:
        return `Unknown event type <b>${event.EventType}</b>`;
    }
  }
}
