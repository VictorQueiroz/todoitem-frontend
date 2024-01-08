import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ITodoItem, TodoItemStatus } from '../todo.service';
import { DateTime } from 'luxon';
import { MatChipSelectionChange } from '@angular/material/chips';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface ICreateTodoFormTodoItem extends Omit<ITodoItem, 'id'> {
  id: number | null;
}

@Component({
  selector: 'app-todo-create-form',
  templateUrl: './todo-create-form.component.html',
  styleUrls: ['./todo-create-form.component.scss'],
})
export class TodoCreateFormComponent {
  @Input() public disabled = false;
  @Input() public isSaving = false;
  @Input() public hideItemId = false;
  @Input() public todoItem: ICreateTodoFormTodoItem = {
    id: null,
    status: TodoItemStatus.Pending,
    assignee: '',
    label: null,
    startDate: DateTime.now().toJSDate(),
    endDate: DateTime.now().plus({ days: 1 }).toJSDate(),
    title: '',
    description: '',
  };
  @Output() public todoItemChange = new EventEmitter<ICreateTodoFormTodoItem>();
  @Output() public onDelete = new EventEmitter<ICreateTodoFormTodoItem>();
  @Output() public onCreate = new EventEmitter<ICreateTodoFormTodoItem>();
  public readonly defaultTodoItemLabels = ['Work', 'Gym', 'Home', 'Finance'];
  public constructor(private readonly matSnackBar: MatSnackBar) {}
  public isDisabled() {
    return this.disabled || this.isSaving;
  }
  public isPending() {
    return this.todoItem.status === TodoItemStatus.Pending;
  }
  public isInProgress() {
    return this.todoItem.status === TodoItemStatus.InProgress;
  }
  public isFinished() {
    return this.todoItem.status === TodoItemStatus.Finished;
  }
  public isDeleted() {
    return this.todoItem.status === TodoItemStatus.Deleted;
  }
  public onChangeLabel(event: MatChipSelectionChange) {
    const sourceValue: unknown = event.source.value;
    let value: string | null;
    if (typeof sourceValue === 'string' && event.source.selected) {
      value = sourceValue;
    } else {
      value = null;
    }
    this.todoItem.label = value;
    this.todoItemChange.emit(this.todoItem);
  }
  public onChangeAssignee(newAssignee: string) {
    this.todoItem.assignee = newAssignee;
    this.todoItemChange.emit(this.todoItem);
  }
  public onChangeStartDate(e: MatDatepickerInputEvent<Date>) {
    if (!e.target.value) {
      return;
    }
    this.todoItem.startDate = e.target.value;
    this.todoItemChange.emit(this.todoItem);
  }
  public onChangeEndDate(e: MatDatepickerInputEvent<Date>) {
    if (!e.target.value) {
      return;
    }
    this.todoItem.endDate = e.target.value;
    this.todoItemChange.emit(this.todoItem);
  }
  public submit() {
    const { todoItem } = this;
    if (!todoItem.title.trim().length) {
      this.matSnackBar.open('Please fill in a title.', undefined, {
        duration: 3000,
      });
      return;
    }
    if (todoItem.id === null) {
      this.onCreate.emit(todoItem);
    } else {
      this.onDelete.emit(todoItem);
    }
  }
}
