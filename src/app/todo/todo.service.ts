import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export enum TodoItemStatus {
  Pending,
  InProgress,
  Finished,
  Deleted,
}

export interface ITodoItem {
  id: number;
  label: string | null;
  title: string;
  startDate: Date;
  endDate: Date;
  status: TodoItemStatus;
  description: string | null;
}

export type TodoFunctionAppResult<T> =
  | {
      error: string;
    }
  | {
      success: T;
    };

export interface IListTodoItemsResult {
  todoItems: ITodoItem[];
  count: number;
}

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  public constructor(private readonly httpClient: HttpClient) {}
  public listTodoItems(offset: number, limit: number, search?: string) {
    const params = new URLSearchParams();
    params.set('offset', `${offset}`);
    params.set('limit', `${limit}`);
    if (search) {
      params.set('search', search);
    }
    return this.httpClient.get<TodoFunctionAppResult<IListTodoItemsResult>>(
      `/api/ListTodoItems?${params.toString()}`
    );
  }
  public updateTodoItem(todoItem: ITodoItem) {
    return this.httpClient.put<TodoFunctionAppResult<true>>(
      '/api/UpdateTodoItem',
      todoItem
    );
  }
  public getTodoItem(id: number) {
    return this.httpClient.get<TodoFunctionAppResult<ITodoItem>>(
      `/api/GetTodoItem?id=${id}`
    );
  }
  public deleteTodoItem(id: number) {
    return this.httpClient.delete<TodoFunctionAppResult<true>>(
      `/api/DeleteTodoItem?id=${id}`
    );
  }
  public createTodoItem(newTodoItem: Omit<ITodoItem, 'id'>) {
    return this.httpClient.post<TodoFunctionAppResult<ITodoItem>>(
      '/api/CreateTodoItem',
      {
        title: newTodoItem.title,
        description: newTodoItem.description,
      }
    );
  }
}
