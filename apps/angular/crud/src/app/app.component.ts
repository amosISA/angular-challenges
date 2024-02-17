import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TodoComponent } from './todos/todo.component';

@Component({
  standalone: true,
  selector: 'app-root',
  template: `
    <app-todos />
  `,
  imports: [TodoComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
