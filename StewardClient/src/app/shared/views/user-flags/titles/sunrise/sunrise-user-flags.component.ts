import { Component, Input, OnChanges } from '@angular/core';
import { BaseComponent } from '@components/base-component/base-component.component';
import { SunriseUserFlags } from '@models/sunrise';
import { SunriseService } from '@services/sunrise/sunrise.service';
import _ from 'lodash';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { faUndo } from '@fortawesome/free-solid-svg-icons';

/** Retreives and displays Sunrise User Flags by XUID. */
@Component({
  selector: 'sunrise-user-flags',
  templateUrl: './sunrise-user-flags.component.html',
  styleUrls: ['./sunrise-user-flags.component.scss'],
})
export class SunriseUserFlagsComponent extends BaseComponent implements OnChanges {
  /** The XUID to look up. */
  @Input() public xuid: bigint;

  /** True while waiting on a request. */
  public isLoading = true;
  /** The error received while loading. */
  public loadError: unknown;
  /** The flags currently applied to the user. */
  public currentFlags: SunriseUserFlags;
  /** The modified flags. */
  public flags: SunriseUserFlags;
  /** True when the "I have verified this" checkbox is ticked. Reset on model change. */
  public verified = false;
  /** True while waiting to submit. */
  public isSubmitting: boolean;
  /** The error received when submitting. */
  public submitError: unknown;
  /** The icon used to refresh the user flags. */
  public refreshIcon = faUndo;

  constructor(public readonly sunrise: SunriseService) {
    super();
  }

  /** True if changes have been made to the flags. */
  public get hasChanges(): boolean {
    return !_.isEqual(this.currentFlags, this.flags);
  }

  /** Initialization hook. */
  public ngOnChanges(): void {
    if (this.xuid === undefined) {
      return;
    }

    this.isLoading = true;
    this.loadError = undefined;
    this.sunrise.getFlagsByXuid(this.xuid).subscribe(
      flags => {
        this.isLoading = false;
        this.currentFlags = flags;
        this.setFlagsToCurrent();
      },
      _error => {
        this.isLoading = false;
        this.loadError = _error; // TODO: Display something useful to the user
      },
    );
  }

  /** Submits the changes. */
  public makeAction(): Observable<SunriseUserFlags> {
    return this.sunrise.putFlagsByXuid(this.xuid, this.flags).pipe(
      tap(value => {
        this.currentFlags = value;
        this.setFlagsToCurrent();
      }),
    );
  }

  /** Resets the flag visuals. */
  public setFlagsToCurrent(): void {
    this.flags = _.clone(this.currentFlags);
  }
}
