import {
  ChangeDetectionStrategy,
  Component,
  InjectionToken,
  inject,
} from '@angular/core';
import { RxState } from '@rx-angular/state';
import { RxFor } from '@rx-angular/template/for';
import { RxLet } from '@rx-angular/template/let';
import { TodoItemComponent } from './todos/todo-item.component';
import { Todo } from './todos/todo.interface';
import { TodoService } from './todos/todo.service';

export interface GlobalState {
  todos: Todo[];
}

export const GLOBAL_RX_STATE = new InjectionToken<RxState<GlobalState>>(
  'GLOBAL_RX_STATE',
);

@Component({
  standalone: true,
  selector: 'app-root',
  template: `
    <ng-container *rxLet="vm$ as vm">
      <app-todo-item *rxFor="let todo of vm.todos" [todo]="todo" />
    </ng-container>
  `,
  imports: [TodoItemComponent, RxLet, RxFor],
  providers: [
    {
      provide: GLOBAL_RX_STATE,
      useFactory: () => new RxState<GlobalState>(),
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  readonly #state = inject(GLOBAL_RX_STATE);
  readonly #todosService = inject(TodoService);
  readonly vm$ = this.#state.select();

  constructor() {
    this.#state.connect('todos', this.#todosService.getAll());
  }
}
