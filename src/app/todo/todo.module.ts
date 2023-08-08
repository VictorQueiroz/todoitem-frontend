import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoListComponent } from './todo-list/todo-list.component';
import { TodoService } from './todo.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { TodoCreateFormComponent } from './todo-create-form/todo-create-form.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TodoItemDetailsComponent } from './todo-item-details/todo-item-details.component';
import { RouterModule } from '@angular/router';
import { TodoItemExistingItemUpdateFormComponent } from './todo-item-existing-item-update-form/todo-item-existing-item-update-form.component';
import { TodoItemSearchPageComponent } from './todo-item-search-page/todo-item-search-page.component';
import { MatInputModule } from '@angular/material/input';
import { AuthInterceptor } from './auth.interceptor';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatChipsModule } from '@angular/material/chips';

@NgModule({
  providers: [
    AuthInterceptor,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    TodoService,
  ],
  declarations: [
    TodoListComponent,
    TodoCreateFormComponent,
    TodoItemDetailsComponent,
    TodoItemExistingItemUpdateFormComponent,
    TodoItemSearchPageComponent,
  ],
  imports: [
    RouterModule,
    HttpClientModule,
    CommonModule,
    MatProgressSpinnerModule,
    FormsModule,
    /**
     * @angular/material stuff
     */
    MatChipsModule,
    MatInputModule,
    MatSnackBarModule,
    MatDialogModule,
    MatGridListModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
  ],
})
export class TodoModule {}
