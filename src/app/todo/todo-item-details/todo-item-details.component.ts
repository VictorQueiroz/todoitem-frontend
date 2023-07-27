import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ITodoItem, TodoService } from '../todo.service';
import { SubscriptionManagerService } from '../subscription-manager.service';
import { finalize, map, mergeMap, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-todo-item-details',
  templateUrl: './todo-item-details.component.html',
  styleUrls: ['./todo-item-details.component.scss'],
})
export class TodoItemDetailsComponent {
  public todoItem: ITodoItem | null = null;
  public isBusy = false;
  public constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly todoService: TodoService,
    private readonly matSnackBar: MatSnackBar,
    private readonly subscriptionManager: SubscriptionManagerService,
    private readonly router: Router
  ) {}
  public ngOnInit(): void {
    this.isBusy = true;
    const sub = this.activatedRoute.params
      .pipe(
        map((params) => {
          const id = parseInt(params['id'], 10);
          if (
            Number.isNaN(id) ||
            !Number.isInteger(id) ||
            !Number.isFinite(id)
          ) {
            return null;
          }
          return id;
        })
      )
      .pipe(
        mergeMap((id) => {
          if (id === null) {
            return of(null);
          }
          return this.todoService.getTodoItem(id).pipe(
            finalize(() => {
              this.isBusy = false;
            })
          );
        })
      )
      .subscribe((res) => {
        if (res === null) {
          return;
        }
        if ('error' in res) {
          this.matSnackBar.open(
            `Failed to get todo item with error: ${res.error}`
          );
          this.todoItem = null;
        } else {
          this.todoItem = res.success;
        }
      });
    this.subscriptionManager.add(sub);
  }
  public onDelete() {
    this.router.navigate(['/']);
  }
}
