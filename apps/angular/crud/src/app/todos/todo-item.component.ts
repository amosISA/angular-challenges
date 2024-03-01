import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { Todo } from './todo.interface';

interface TodoItemState {
  todo: Todo;
}

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p>{{ todo().title }}</p>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoItemComponent extends RxState<TodoItemState> {
  todo = input.required<Todo>();
  $vm = this.select();

  constructor() {
    super();
  }
}
