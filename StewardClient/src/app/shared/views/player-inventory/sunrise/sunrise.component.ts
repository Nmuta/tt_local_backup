import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { BaseComponent } from '@components/base-component/base-component.component';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { SunrisePlayerInventory } from '@models/sunrise';
import { SunriseInventoryItem } from '@models/sunrise/inventory-items';
import { SunriseService } from '@services/sunrise';
import { NEVER, Subject } from 'rxjs';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';

/** A model for identifying a property of an object and mapping that to a title & description for a simple expando. */
interface PropertyToExpandoData<T> {
  property: keyof T;
  title: string;
  description: string;
}

/** Displays the sunrise user's player inventory. */
@Component({
  selector: 'sunrise-player-inventory',
  templateUrl: './sunrise.component.html',
  styleUrls: ['./sunrise.component.scss'],
})
export class SunrisePlayerInventoryComponent extends BaseComponent implements OnInit, OnChanges {
  @Input() public identity: IdentityResultAlpha;

  /** The located inventory. */
  public inventory: SunrisePlayerInventory;
  /** The computed total number of cars. */
  public totalCars = BigInt(0);
  /** True while loading. */
  public get isLoading(): boolean {
    return !this.inventory;
  }
  /** The last error. */
  public error: unknown;

  /** The properties to display in a standard fashion. */
  public whatToShow: PropertyToExpandoData<SunrisePlayerInventory>[] = [];

  /** Intermediate event that is fired when @see identity changes. */
  private identity$ = new Subject<IdentityResultAlpha>();

  constructor(private readonly sunrise: SunriseService) {
    super();
  }

  /** Lifecycle hook. */
  public ngOnInit(): void {
    this.identity$
      .pipe(
        takeUntil(this.onDestroy$),
        tap(() => {
          this.inventory = null;
          this.error = null;
        }),
        switchMap(identity => this.sunrise.getPlayerInventoryByXuid(identity.xuid)),
        catchError((error, _observable) => {
          this.error = error;
          return NEVER;
        }),
      )
      .subscribe(inventory => {
        this.inventory = inventory;
        this.whatToShow = this.makeWhatToShow();
      });

    this.identity$.next(this.identity);
  }

  /** Lifecycle hook. */
  public ngOnChanges(_changes: SimpleChanges): void {
    this.identity$.next(this.identity);
  }

  private makeWhatToShow(): PropertyToExpandoData[] {
    const inventory = this.inventory;

    function makeEntry(property: keyof SunrisePlayerInventory, title: string): PropertyToExpandoData {
      const count = (inventory[property] as SunriseInventoryItem[]).reduce(
        (accumulator, entry) => accumulator + entry.quantity,
        BigInt(0),
      );
      return {
        property: property,
        title: title,
        description: `${count} Total`,
      };
    }

    return [
      makeEntry('cars', 'Cars'),
      makeEntry('vanityItems', 'Vanity Items'),
      makeEntry('carHorns', 'Car Horns'),
      makeEntry('quickChatLines', 'Quick Chat Lines'),
      makeEntry('emotes', 'Emotes'),
      makeEntry('rebuilds', 'Rebuilds'),
      makeEntry('creditRewards', 'Credit Rewards'),
      makeEntry('barnFindRumors', 'Barn Find Rumors'),
      makeEntry('perks', 'Perks'),
    ];
  }
}
