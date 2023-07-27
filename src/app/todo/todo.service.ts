import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

export interface ITodoItem {
  id: number;
  title: string;
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
  public listTodoItems(offset: number, limit: number) {
    const url = this.#createUrl('/api/ListTodoItems');
    url.searchParams.set('offset', `${offset}`);
    url.searchParams.set('limit', `${limit}`);
    return this.httpClient.get<TodoFunctionAppResult<IListTodoItemsResult>>(
      url.href
    );
  }
  public updateTodoItem(todoItem: ITodoItem) {
    const url = this.#createUrl('/api/UpdateTodoItem');
    return this.httpClient.put<TodoFunctionAppResult<true>>(url.href, todoItem);
  }
  public deleteTodoItem(id: number) {
    const url = this.#createUrl('/api/DeleteTodoItem');
    url.searchParams.set('id', `${id}`);
    return this.httpClient.delete<TodoFunctionAppResult<true>>(url.href);
  }
  public createTodoItem(newTodoItem: Omit<ITodoItem, 'id'>) {
    const url = this.#createUrl('/api/CreateTodoItem');
    return this.httpClient.post<TodoFunctionAppResult<ITodoItem>>(url.href, {
      title: newTodoItem.title,
      description: newTodoItem.description,
    });
  }
  #createUrl(url: string) {
    const out = new URL(url, environment.azure.baseUrl);
    out.searchParams.set('code', environment.azure.code);
    out.searchParams.set('clientId', environment.azure.clientId);
    return out;
  }
}
