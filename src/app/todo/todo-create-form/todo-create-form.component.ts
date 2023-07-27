import { Component, Input } from '@angular/core';
import { ITodoItem } from '../todo.service';

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
    title: '',
    description: '',
  };
  @Input() public onChangeDescription!: (
    value: ICreateTodoFormTodoItem
  ) => void;
  @Input() public onChangeTitle!: (value: ICreateTodoFormTodoItem) => void;
  @Input() public onDelete!: (value: ICreateTodoFormTodoItem) => void;
  @Input() public onCreate!: (value: ICreateTodoFormTodoItem) => void;
  public isDisabled() {
    return this.disabled || this.isSaving;
  }
}
