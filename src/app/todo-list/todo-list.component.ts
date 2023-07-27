import { Component, OnDestroy, OnInit } from '@angular/core';
import { ITodoItem, TodoService } from '../todo/todo.service';
import { Subscription, finalize } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TodoItemConfirmActionComponent } from './todo-item-confirm-action.component';
import { ICreateTodoFormTodoItem } from '../todo/todo-create-form/todo-create-form.component';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  readonly #subscriptions = new Set<Subscription>();
  readonly #onScrollWindow = () => {
    const scrolledPercentage =
      window.scrollY /
      (document.body.scrollHeight - document.body.clientHeight);
    if (scrolledPercentage > 0.9) {
      this.#getMoreTodoItems();
    }
  };
  public todoItems = new Array<ITodoItem>();
  public newTodoItem: ICreateTodoFormTodoItem = {
    id: null,
    title: '',
    description: '',
  };
  public todoItemCount: number | null = null;
  public busyItemIds = new Set<number>();
  public isGettingTodoItems = false;
  public isCreatingTodoItem = false;
  public constructor(
    private readonly todoService: TodoService,
    private readonly matDialog: MatDialog,
    private readonly snackBar: MatSnackBar
  ) {}
  public ngOnInit(): void {
    this.#getMoreTodoItems();
    window.addEventListener('scroll', this.#onScrollWindow);
  }
  public ngOnDestroy(): void {
    window.removeEventListener('scroll', this.#onScrollWindow);
  }
  public isBusy(todoItem: ITodoItem) {
    return this.busyItemIds.has(todoItem.id);
  }
  public deleteTodoItem(input: ICreateTodoFormTodoItem) {
    if (input.id === null) {
      return;
    }
    const todoItem = {
      ...input,
      id: input.id,
    };
    const dialogRef = this.matDialog.open(ConfirmTodoItemDeletionDialog, {
      width: '250px',
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (!result || this.isBusy(todoItem)) {
        return;
      }
      this.busyItemIds.add(todoItem.id);
      const sub = this.todoService
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
      this.#addSubscription(sub);
    });
  }
  public createNewTodoItem(input: ICreateTodoFormTodoItem) {
    this.isCreatingTodoItem = true;
    const sub = this.todoService
      .createTodoItem(input)
      .pipe(
        finalize(() => {
          this.isCreatingTodoItem = false;
        })
      )
      .subscribe((newTodoItem) => {
        if ('error' in newTodoItem) {
          this.snackBar.open(
            `Failed to add new todo item with error: ${newTodoItem.error}`
          );
          return;
        }
        this.newTodoItem = {
          id: null,
          title: '',
          description: '',
        };
        this.todoItems.unshift(newTodoItem.success);
      });
    this.#addSubscription(sub);
  }
  public onChangeNewTodoItem(input: ICreateTodoFormTodoItem) {
    this.newTodoItem = input;
  }
  public onChangeDescription(input: ICreateTodoFormTodoItem) {
    const todoItem = this.#createTodoFormTodoItemToTodoItemOrNull(input);
    if (todoItem === null || this.isBusy(todoItem)) {
      return;
    }
    this.busyItemIds.add(todoItem.id);
    const sub = this.todoService
      .updateTodoItem(todoItem)
      .pipe(
        finalize(() => {
          this.busyItemIds.delete(todoItem.id);
        })
      )
      .subscribe((res) => {
        console.log(res);
      });
    this.#addSubscription(sub);
  }
  public hasMoreAvailable() {
    return this.todoItemCount === this.todoItems.length;
  }
  #getMoreTodoItems() {
    if (this.isGettingTodoItems || this.hasMoreAvailable()) {
      return;
    }
    this.isGettingTodoItems = true;
    this.#addSubscription(
      this.todoService
        .listTodoItems(this.todoItems.length, 10)
        .pipe(
          finalize(() => {
            this.isGettingTodoItems = false;
          })
        )
        .subscribe((result) => {
          if ('error' in result) {
            this.snackBar.open(
              `Failed to list todo items with error: ${result}`
            );
          } else {
            const { count, todoItems } = result.success;
            this.todoItems = [...this.todoItems, ...todoItems];
            this.todoItemCount = count;
          }
        })
    );
  }
  #addSubscription(sub: Subscription) {
    sub.add(() => {
      this.#subscriptions.delete(sub);
    });
    this.#subscriptions.add(sub);
  }
  #createTodoFormTodoItemToTodoItemOrNull(
    input: ICreateTodoFormTodoItem
  ): ITodoItem | null {
    if (input.id === null) {
      return null;
    }
    return {
      ...input,
      id: input.id,
    };
  }
}
