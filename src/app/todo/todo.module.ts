import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoListComponent } from '../todo-list/todo-list.component';
import { TodoService } from './todo.service';
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  providers: [TodoService],
  declarations: [TodoListComponent],
  imports: [
    HttpClientModule,
    CommonModule,
    MatProgressSpinnerModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
  ],
})
export class TodoModule {}
