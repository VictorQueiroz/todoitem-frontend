import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface IEvent {
  Id?: number;
  TaskId: number;
  AssignedUser: string | null;
  EventType: string;
  EventTime: string;
}

@Injectable({
  providedIn: 'root'
})
export class EventListService {
  constructor(private readonly httpClient: HttpClient) { }

  public getEvents(limit: number = 15) {
    const params = new URLSearchParams();
    params.set('limit', `${limit}`);
    return this.httpClient.get<IEvent[]>(`/api/get-events?${params.toString()}`);
  }
}
