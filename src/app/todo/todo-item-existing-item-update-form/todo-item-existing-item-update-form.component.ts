import { Component, Input, OnInit } from '@angular/core';
import { ITodoItem, TodoService } from '../todo.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TodoItemConfirmActionComponent } from 'src/app/todo-list/todo-item-confirm-action.component';
import { Subscription, finalize } from 'rxjs';
import { ICreateTodoFormTodoItem } from '../todo-create-form/todo-create-form.component';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

export function createTodoFormTodoItemToTodoItemOrNull(
  input: ICreateTodoFormTodoItem
): ITodoItem | null {
  if (input.id === null) {
    return null;
  }
  return input as ITodoItem;
}

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
  selector: 'app-todo-item-existing-item-update-form',
  templateUrl: './todo-item-existing-item-update-form.component.html',
  styleUrls: ['./todo-item-existing-item-update-form.component.scss'],
})
export class TodoItemExistingItemUpdateFormComponent {
  @Input() public onDelete?: (todoItem: ITodoItem) => void;
  @Input() public todoItem!: ITodoItem;
  @Input() public hideItemId: boolean = false;
  readonly #subscriptions = new Set<Subscription>();
  public isBusy = false;
  public isSaving = false;
  // public todoItem: ITodoItem | null = null;
  public constructor(
    private readonly matDialog: MatDialog,
    private readonly todoService: TodoService,
    private readonly matSnackBar: MatSnackBar
  ) {}
  public deleteTodoItem(input: ICreateTodoFormTodoItem) {
    const todoItem = createTodoFormTodoItemToTodoItemOrNull(input);
    if (!todoItem) {
      return;
    }
    const dialogRef = this.matDialog.open(ConfirmTodoItemDeletionDialog);
    const sub = dialogRef.afterClosed().subscribe((result: boolean) => {
      if (!result || this.isBusy) {
        return;
      }
      this.isBusy = true;
      const sub = this.todoService
        .deleteTodoItem(todoItem.id)
        .pipe(
          finalize(() => {
            this.isBusy = false;
          })
        )
        .subscribe((res) => {
          if ('success' in res) {
            if (res.success) {
              if (this.onDelete) this.onDelete(todoItem);
            }
          } else {
            this.matSnackBar.open(`Failed to delete todo item: ${res.error}`);
          }
        });
      this.#addSubscription(sub);
    });
    this.#addSubscription(sub);
  }
  public onChangeTodoItem(input: ICreateTodoFormTodoItem) {
    const todoItem = createTodoFormTodoItemToTodoItemOrNull(input);
    if (todoItem === null || this.isSaving) {
      return;
    }
    this.isSaving = true;
    const sub = this.todoService
      .updateTodoItem(todoItem)
      .pipe(
        finalize(() => {
          this.isSaving = false;
        })
      )
      .subscribe((res) => {
        if (!('success' in res)) {
          this.matSnackBar.open(
            `Failed to update item with error: ${res.error}`
          );
        }
      });
    this.#addSubscription(sub);
  }
  #addSubscription(sub: Subscription) {
    this.#subscriptions.add(sub);
  }
}
