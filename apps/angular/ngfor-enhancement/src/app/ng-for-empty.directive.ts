import { NgFor } from '@angular/common';
import {
  Directive,
  EmbeddedViewRef,
  Input,
  TemplateRef,
  ViewContainerRef,
  computed,
  effect,
  inject,
  signal,
  ɵstringify as stringify,
} from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[ngFor]',
  standalone: true,
  hostDirectives: [{ directive: NgFor, inputs: ['ngForOf', 'ngForTrackBy'] }],
})
export class NgForEmptyDirective<T> {
  readonly #containerRef = inject(ViewContainerRef);
  readonly #emptyTemplateRef = signal<TemplateRef<unknown> | null>(null);

  readonly #shouldDisplayEmptyTemplate = computed(
    () => !this.#items().length && this.#emptyTemplateRef(),
  );
  #emptyViewRef?: EmbeddedViewRef<unknown>;
  readonly #items = signal<T[]>([]);

  @Input({ required: true }) set ngForOf(value: T[]) {
    this.#items.set(value);
  }

  @Input() set ngForEmpty(templateRef: TemplateRef<unknown>) {
    assertTemplate('ngForEmpty', templateRef);
    this.#emptyTemplateRef.set(templateRef);
  }

  constructor() {
    effect(() => {
      this.#emptyViewRef?.destroy();
      if (this.#shouldDisplayEmptyTemplate())
        this.#emptyViewRef = this.#containerRef.createEmbeddedView(
          this.#emptyTemplateRef()!,
        );
    });
  }
}

function assertTemplate(
  property: string,
  templateRef: TemplateRef<unknown> | null,
): void | never {
  const isTemplateRefOrNull = !!(
    !templateRef || templateRef.createEmbeddedView
  );
  if (!isTemplateRefOrNull) {
    throw new Error(
      `${property} must be a TemplateRef, but received '${stringify(templateRef)}'.`,
    );
  }
}
