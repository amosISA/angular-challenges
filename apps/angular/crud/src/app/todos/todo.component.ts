import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-todos',
  templateUrl: './todo.component.html',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoComponent {}
