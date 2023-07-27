import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  standalone: true,
  imports: [MatButtonModule, MatDialogModule],
  selector: 'todo-item-confirm-action',
  templateUrl: './todo-item-confirm-action.component.html',
})
export class TodoItemConfirmActionComponent {
  @Input() title: string = '';
  @Input() description: string = '';
  public constructor() {}
}
