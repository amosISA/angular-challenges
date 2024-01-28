import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
  FakeHttpService,
  randTeacher,
} from '../../data-access/fake-http.service';
import { TeacherStore } from '../../data-access/teacher.store';
import { CardRowDirective } from '../../directive/card-row.directive';
import { CardComponent } from '../../ui/card/card.component';
import { ListItemComponent } from '../../ui/list-item/list-item.component';

@Component({
  selector: 'app-teacher-card',
  template: `
    <app-card
      (addItem)="addTeacher()"
      [list]="teachers()"
      customClass="bg-light-red">
      <img src="assets/img/teacher.png" width="200px" />
      <ng-template [appCardRow]="teachers()" let-teacher>
        <app-list-item (delete)="deleteTeacher(teacher.id)">
          <div>{{ teacher.firstName }} {{ teacher.lastName }}</div>
          <div>{{ teacher.subject }}</div>
        </app-list-item>
      </ng-template>
    </app-card>
  `,
  styles: [
    `
      :host {
        background-color: rgba(250, 0, 0, 0.1);
      }
    `,
  ],
  standalone: true,
  imports: [CardComponent, CardRowDirective, ListItemComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeacherCardComponent implements OnInit {
  #http = inject(FakeHttpService);
  #store = inject(TeacherStore);
  #destroy = inject(DestroyRef);
  teachers = toSignal(this.#store.teachers$, { initialValue: [] });

  ngOnInit(): void {
    this.#http.fetchTeachers$
      .pipe(takeUntilDestroyed(this.#destroy))
      .subscribe((t) => {
        console.log(t);
        this.#store.addAll(t);
      });
  }

  addTeacher(): void {
    this.#store.addOne(randTeacher());
  }

  deleteTeacher(id: number): void {
    this.#store.deleteOne(id);
  }
}
