import { Component, DoCheck, OnDestroy, OnInit } from '@angular/core';
import { ITodoItem, TodoService } from '../todo/todo.service';
import { Subscription, finalize } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TodoItemConfirmActionComponent } from './todo-item-confirm-action.component';
import { ICreateTodoFormTodoItem } from '../todo/todo-create-form/todo-create-form.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  BreakpointObserver,
  Breakpoints,
  MediaMatcher,
} from '@angular/cdk/layout';

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
export class TodoListComponent implements OnInit, OnDestroy, DoCheck {
  readonly #subscriptions = new Set<Subscription>();
  readonly #onScrollWindow = () => {
    const scrolledPercentage =
      window.scrollY /
      (document.body.scrollHeight - document.body.clientHeight);
    if (scrolledPercentage > 0.9) {
      this.#getMoreTodoItems();
    }
  };
  #searchTimeout: number | null = null;
  public todoItems = new Array<ITodoItem>();
  public search = {
    newValue: '',
    oldValue: '',
  };
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
    private readonly snackBar: MatSnackBar,
    private readonly breakpointObserver: BreakpointObserver,
    private readonly mediaMatcher: MediaMatcher
  ) {}
  public breakpoints = {
    smallDevice: true,
    largeDevice: false,
    extraLargeDevice: false,
  };
  public groupedTodoItems: {
    groups: ITodoItem[][];
    itemsPerRow: number;
    count: number;
  } = {
    count: this.todoItems.length,
    groups: [],
    itemsPerRow: 1,
  };
  public ngOnInit(): void {
    const breakpointSubscription = this.breakpointObserver
      .observe([
        Breakpoints.Large,
        Breakpoints.XLarge,
        Breakpoints.Small,
        Breakpoints.XSmall,
      ])
      .subscribe(() => {
        this.breakpoints = {
          smallDevice: false,
          largeDevice: false,
          extraLargeDevice: false,
        };
        for (const check of [
          {
            breakpoints: [Breakpoints.Small, Breakpoints.XSmall],
            change: () => {
              this.breakpoints.smallDevice = true;
            },
          },
          {
            breakpoints: [Breakpoints.Medium, Breakpoints.Large],
            change: () => {
              this.breakpoints.largeDevice = true;
            },
          },
          {
            breakpoints: [Breakpoints.XLarge],
            change: () => {
              this.breakpoints.extraLargeDevice = true;
            },
          },
        ]) {
          if (
            check.breakpoints.some(
              (b) => this.mediaMatcher.matchMedia(b).matches
            )
          ) {
            check.change();
            break;
          }
        }
      });
    this.#getMoreTodoItems();
    window.addEventListener('scroll', this.#onScrollWindow);
    this.#addSubscription(breakpointSubscription);
  }
  public ngDoCheck() {
    const rows = this.#todoItemRows();
    if (
      this.todoItems.length === this.groupedTodoItems.count &&
      rows.itemsPerRow === this.groupedTodoItems.itemsPerRow
    ) {
      return;
    }
    this.groupedTodoItems = rows;
  }
  public ngOnDestroy(): void {
    for (const s of this.#subscriptions) {
      s.unsubscribe();
      this.#subscriptions.delete(s);
    }
    window.removeEventListener('scroll', this.#onScrollWindow);
  }
  public isBusy(todoItem: ITodoItem) {
    return this.busyItemIds.has(todoItem.id);
  }
  public onTodoItemDeleted(todoItem: ITodoItem) {
    this.todoItems = this.todoItems.filter((t) => t.id !== todoItem.id);
  }
  public createNewTodoItem(input: ICreateTodoFormTodoItem) {
    if (this.isCreatingTodoItem) {
      return;
    }
    this.isCreatingTodoItem = true;
    const sub = this.todoService
      .createTodoItem(input)
      .pipe(
        finalize(() => {
          this.isCreatingTodoItem = false;
        })
      )
      .subscribe((res) => {
        if ('error' in res) {
          this.#openSnackbar(
            `Failed to add new todo item with error: ${res.error}`
          );
          return;
        }
        this.newTodoItem = {
          id: null,
          title: '',
          description: '',
        };
        if (typeof this.#validSearch(this.search.newValue) !== 'undefined') {
          this.#reset();
          return;
        }
        this.todoItems.unshift(res.success);
        if (this.todoItemCount !== null) {
          this.todoItemCount++;
        }
      });
    this.#addSubscription(sub);
  }
  public onChangeNewTodoItem(input: ICreateTodoFormTodoItem) {
    this.newTodoItem = input;
  }
  public onChangeTodoItem(input: ICreateTodoFormTodoItem) {
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
    return (
      this.todoItemCount !== null &&
      this.todoItemCount === this.todoItems.length
    );
  }
  public onSearchChanged(event: Event) {
    if (!(event.currentTarget instanceof HTMLInputElement)) {
      return;
    }
    this.search = {
      newValue: event.currentTarget.value,
      oldValue: this.search.newValue,
    };
    if (this.#searchTimeout) {
      clearTimeout(this.#searchTimeout);
      this.#searchTimeout = null;
    }
    this.#searchTimeout = window.setTimeout(() => {
      this.#reset();
    }, 100);
  }
  #reset() {
    if (
      typeof this.#validSearch(this.search.newValue) !== 'undefined' ||
      typeof this.#validSearch(this.search.oldValue) !== 'undefined'
    ) {
      this.todoItems = [];
      this.todoItemCount = null;
      this.groupedTodoItems = this.#todoItemRows();
    }
    this.#getMoreTodoItems();
  }
  #todoItemRows() {
    const todoItems = Array.from(this.todoItems);
    const groups = new Array<ITodoItem[]>();
    let itemsPerRow = 1;
    if (this.breakpoints.largeDevice) {
      itemsPerRow = 2;
    } else if (this.breakpoints.extraLargeDevice) {
      itemsPerRow = 4;
    }

    while (todoItems.length > 0) {
      const group = todoItems.splice(0, itemsPerRow);
      groups.push(group);
    }
    return {
      groups,
      count: this.todoItems.length,
      itemsPerRow,
    };
  }
  #openSnackbar(content: string, title?: string) {
    this.snackBar.open(content, title, {
      duration: 5000,
    });
  }
  #validSearch(value: string) {
    return value.trim().length > 0 ? value : undefined;
  }
  #getMoreTodoItems() {
    if (this.isGettingTodoItems || this.hasMoreAvailable()) {
      return;
    }
    const initialSearch = this.search.newValue;
    this.isGettingTodoItems = true;
    this.#addSubscription(
      this.todoService
        .listTodoItems(
          this.todoItems.length,
          10,
          this.#validSearch(initialSearch)
        )
        .pipe(
          finalize(() => {
            this.isGettingTodoItems = false;
            if (
              initialSearch !== this.search.newValue &&
              this.#validSearch(this.search.newValue)
            ) {
              this.#reset();
            }
          })
        )
        .subscribe((result) => {
          if ('error' in result) {
            this.#openSnackbar(
              `Failed to list todo items with error: ${result}`,
              'Error'
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
