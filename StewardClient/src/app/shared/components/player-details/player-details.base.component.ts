import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { BaseComponent } from '@components/base-component/base-component.component';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/** Defines the player details component. */
@Component({
  template: '',
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export abstract class PlayerDetailsBaseComponent<T extends {xuid: string}>
  extends BaseComponent
  implements OnChanges {
  /** Gamertag to lookup for player details. */
  @Input() public gamertag: string;
  /** Emits xuid when it is found. */
  @Output() public xuidFoundEvent = new EventEmitter<string>();

  /** True while waiting on a request. */
  public isLoading = true;
  /** The error received while loading. */
  public loadError: unknown;
  /** The player details */
  public playerDetails: T;

  constructor() {
    super();
  }

  /** Child class should implement. */
  public abstract makeRequest$(): Observable<T>;

  /** Initialization hook. */
  public ngOnChanges(): void {
    this.isLoading = true;
    this.loadError = undefined;

    const details$ = this.makeRequest$();
    details$.pipe(takeUntil(this.onDestroy$)).subscribe(
      details => {
        this.isLoading = false;
        this.playerDetails = details;
        this.xuidFoundEvent.emit(this.playerDetails.xuid);
      },
      error => {
        this.isLoading = false;
        this.loadError = error;
      }
    );
  }
}
