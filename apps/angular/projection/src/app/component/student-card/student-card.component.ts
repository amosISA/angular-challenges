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
  randStudent,
} from '../../data-access/fake-http.service';
import { StudentStore } from '../../data-access/student.store';
import { CardRowDirective } from '../../directive/card-row.directive';
import { CardComponent } from '../../ui/card/card.component';
import { ListItemComponent } from '../../ui/list-item/list-item.component';

@Component({
  selector: 'app-student-card',
  template: `
    <app-card (addItem)="addStudent()" [list]="students()">
      <img src="assets/img/student.webp" width="200px" />
      <ng-template [appCardRow]="students()" let-student>
        <app-list-item (delete)="deleteStudent(student.id)">
          <div>{{ student.firstName }} {{ student.lastName }}</div>
          <div>{{ student.school }}</div>
          <div>
            {{ student.mainTeacher.firstName }}
            {{ student.mainTeacher.lastName }}
          </div>
          <div>{{ student.mainTeacher.subject }}</div>
        </app-list-item>
      </ng-template>
    </app-card>
  `,
  standalone: true,
  styles: [
    `
      :host {
        background-color: rgba(0, 250, 0, 0.1);
      }
    `,
  ],
  imports: [CardComponent, CardRowDirective, ListItemComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentCardComponent implements OnInit {
  #http = inject(FakeHttpService);
  #store = inject(StudentStore);
  #destroy = inject(DestroyRef);
  students = toSignal(this.#store.students$, { initialValue: [] });

  ngOnInit(): void {
    this.#http.fetchStudents$
      .pipe(takeUntilDestroyed(this.#destroy))
      .subscribe((s) => this.#store.addAll(s));
  }

  addStudent(): void {
    this.#store.addOne(randStudent());
  }

  deleteStudent(id: number): void {
    this.#store.deleteOne(id);
  }
}
