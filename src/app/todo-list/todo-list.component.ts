import { Component, OnDestroy, OnInit } from '@angular/core';
import { ITodoItem, TodoService } from '../todo/todo.service';
import { finalize } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TodoItemConfirmActionComponent } from './todo-item-confirm-action.component';

@Component({
  imports: [TodoItemConfirmActionComponent],
  standalone: true,
  template:
    '<todo-item-confirm-action title="Are you sure you want to delete this item?"></todo-item-confirm-action>',
})
class ConfirmTodoItemDeletionDialog {
  public constructor(
    public dialogRef: MatDialogRef<ConfirmTodoItemDeletionDialog>
  ) {}
}

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
})
export class TodoListComponent implements OnInit, OnDestroy {
  readonly #onScrollWindow = () => {
    const scrolledPercentage =
      window.scrollY /
      (document.body.scrollHeight - document.body.clientHeight);
    if (scrolledPercentage > 0.9) {
      this.getMoreTodoItems();
    }
  };
  public todoItems = new Array<ITodoItem>();
  public todoItemCount: number | null = null;
  public busyItemIds = new Set<number>();
  public isGettingTodoItems = false;
  public constructor(
    private readonly todoService: TodoService,
    private readonly matDialog: MatDialog
  ) {}
  public ngOnInit(): void {
    this.getMoreTodoItems();
    window.addEventListener('scroll', this.#onScrollWindow);
  }
  public ngOnDestroy(): void {
    window.removeEventListener('scroll', this.#onScrollWindow);
  }
  public isBusy(todoItem: ITodoItem) {
    return this.busyItemIds.has(todoItem.id);
  }
  public deleteTodoItem(todoItem: ITodoItem) {
    const dialogRef = this.matDialog.open(ConfirmTodoItemDeletionDialog, {
      width: '250px',
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (!result || this.isBusy(todoItem)) {
        return;
      }
      this.busyItemIds.add(todoItem.id);
      this.todoService
        .deleteTodoItem(todoItem.id)
        .pipe(
          finalize(() => {
            this.busyItemIds.delete(todoItem.id);
          })
        )
        .subscribe((res) => {
          if ('success' in res && res.success) {
            this.todoItems = this.todoItems.filter((t) => t.id !== todoItem.id);
          }
        });
    });
  }
  private getMoreTodoItems() {
    if (
      this.isGettingTodoItems ||
      this.todoItemCount === this.todoItems.length
    ) {
      return;
    }
    this.isGettingTodoItems = true;
    this.todoService
      .listTodoItems(this.todoItems.length, 10)
      .pipe(
        finalize(() => {
          this.isGettingTodoItems = false;
        })
      )
      .subscribe((result) => {
        if ('error' in result) {
          console.error('failed to list todo items with error: %o', result);
        } else {
          const { count, todoItems } = result.success;
          this.todoItems = [...this.todoItems, ...todoItems];
          this.todoItemCount = count;
        }
        console.log(this.todoItemCount, this.todoItems.length);
      });
  }
  public onChangeDescription(todoItem: ITodoItem) {
    if (this.isBusy(todoItem)) {
      return;
    }
    this.busyItemIds.add(todoItem.id);
    this.todoService
      .updateTodoItem(todoItem)
      .pipe(
        finalize(() => {
          this.busyItemIds.delete(todoItem.id);
        })
      )
      .subscribe((res) => {
        console.log(res);
      });
  }
}
