import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { BaseComponent } from '@components/base-component/base-component.component';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { SunrisePlayerInventory } from '@models/sunrise';
import { SunriseService } from '@services/sunrise';
import { NEVER, Subject } from 'rxjs';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';

/** Displays the sunrise user's player inventory. */
@Component({
  selector: 'sunrise-player-inventory',
  templateUrl: './sunrise.component.html',
  styleUrls: ['./sunrise.component.scss']
})
export class SunrisePlayerInventoryComponent extends BaseComponent implements OnInit, OnChanges {
  @Input() public identity: IdentityResultAlpha;

  /** The located inventory. */
  public inventory: SunrisePlayerInventory;
  /** The last error. */
  public error: unknown;

  /** Intermediate event that is fired when @see identity changes. */
  private identity$ = new Subject<IdentityResultAlpha>();

  constructor(private readonly sunrise: SunriseService) { super(); }

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
      ).subscribe(inventory => {
        this.inventory = inventory;
      });
  }

  /** Lifecycle hook. */
  public ngOnChanges(_changes: SimpleChanges): void {
    this.identity$.next(this.identity);
  }
}
