import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { randText } from '@ngneat/falso';
import { Observable } from 'rxjs';
import { Todo } from './todo.interface';

@Injectable({ providedIn: 'root' })
export class TodoService {
  readonly #http = inject(HttpClient);

  getAll(): Observable<Todo[]> {
    return this.#http.get<Todo[]>('https://jsonplaceholder.typicode.com/todos');
  }

  update(id: number): Observable<Todo> {
    return this.#http.put<Todo>(
      `https://jsonplaceholder.typicode.com/todos/${id}`,
      JSON.stringify({
        id,
        title: randText(),
      }),
      {
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      },
    );
  }

  delete(id: number): Observable<Todo> {
    return this.#http.delete<Todo>(
      `https://jsonplaceholder.typicode.com/todos/${id}`,
    );
  }
}
