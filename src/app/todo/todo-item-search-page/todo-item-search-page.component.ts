import { Component } from '@angular/core';
import { SubscriptionManagerService } from '../subscription-manager.service';
import { TodoService } from '../todo.service';

@Component({
  selector: 'app-todo-item-search-page',
  templateUrl: './todo-item-search-page.component.html',
  styleUrls: ['./todo-item-search-page.component.scss'],
})
export class TodoItemSearchPageComponent {
  public constructor(
    private readonly subscriptionManager: SubscriptionManagerService,
    private readonly todoService: TodoService
  ) {}
}
