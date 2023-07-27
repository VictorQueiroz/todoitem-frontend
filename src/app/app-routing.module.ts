import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TodoListComponent } from './todo-list/todo-list.component';
import { TodoModule } from './todo/todo.module';
import { NotFoundComponent } from './not-found/not-found.component';
import { TodoItemDetailsComponent } from './todo/todo-item-details/todo-item-details.component';
import { TodoItemSearchPageComponent } from './todo/todo-item-search-page/todo-item-search-page.component';

const routes: Routes = [
  {
    path: '',
    component: TodoListComponent,
  },
  {
    path: 'search',
    component: TodoItemSearchPageComponent,
  },
  {
    path: 'todo-item/:id',
    component: TodoItemDetailsComponent,
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];

@NgModule({
  declarations: [],
  imports: [TodoModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
