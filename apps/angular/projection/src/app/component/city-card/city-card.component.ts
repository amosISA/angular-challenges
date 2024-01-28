import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { CityStore } from '../../data-access/city.store';
import {
  FakeHttpService,
  randomCity,
} from '../../data-access/fake-http.service';
import { CardRowDirective } from '../../directive/card-row.directive';
import { CardComponent } from '../../ui/card/card.component';
import { ListItemComponent } from '../../ui/list-item/list-item.component';

@Component({
  selector: 'app-city-card',
  template: `
    <app-card
      (addItem)="addCity()"
      [list]="cities()"
      customClass="bg-light-blue">
      <img src="assets/img/city.png" width="200px" />
      <ng-template [appCardRow]="cities()" let-city>
        <app-list-item (delete)="deleteCity(city.id)">
          <div>{{ city.country }}</div>
          <div>{{ city.name }}</div>
        </app-list-item>
      </ng-template>
    </app-card>
  `,
  standalone: true,
  styles: [
    `
      :host {
        background-color: rgba(0, 0, 250, 0.1);
      }
    `,
  ],
  imports: [CardComponent, CardRowDirective, ListItemComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CityCardComponent implements OnInit {
  #http = inject(FakeHttpService);
  #store = inject(CityStore);
  #destroy = inject(DestroyRef);
  cities = toSignal(this.#store.cities$, { initialValue: [] });

  ngOnInit(): void {
    this.#http.fetchCities$
      .pipe(takeUntilDestroyed(this.#destroy))
      .subscribe((s) => this.#store.addAll(s));
  }

  addCity(): void {
    this.#store.addOne(randomCity());
  }

  deleteCity(id: number): void {
    this.#store.deleteOne(id);
  }
}
