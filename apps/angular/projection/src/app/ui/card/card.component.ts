import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
} from '@angular/core';
import { CardRowDirective } from '../../directive/card-row.directive';

@Component({
  selector: 'app-card',
  template: `
    <div class="flex w-fit flex-col gap-3 rounded-md border-2 border-black p-4">
      <ng-content select="img" />

      <section>
        @for (item of list; track item) {
          <ng-template
            *ngTemplateOutlet="row ?? empty; context: { $implicit: item }" />
          <ng-template #empty>no template</ng-template>
        }
      </section>

      <button
        class="rounded-sm border border-blue-500 bg-blue-300 p-2"
        (click)="addItem.emit()">
        Add
      </button>
    </div>
  `,
  standalone: true,
  imports: [NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent<T> {
  @Output() addItem: EventEmitter<void> = new EventEmitter<void>();
  @Input({ required: true }) list: T[] | null = null;

  @ContentChild(CardRowDirective, { read: TemplateRef }) row:
    | TemplateRef<T>
    | undefined;
}
