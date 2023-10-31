import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { Select, Store } from '@ngxs/store';
import { ChangelogService } from '@services/changelog/changelog.service';
import { TimeService } from '@services/time/time.service';
import { ConfigureShowVerifyCheckboxPopup } from '@shared/state/user-settings/user-settings.actions';
import {
  TimeConfig,
  UserSettingsState,
  UserSettingsStateModel,
} from '@shared/state/user-settings/user-settings.state';
import { UserTourService } from '@tools-app/pages/home/tour/tour.service';
import { DateTime } from 'luxon';
import { Observable, takeUntil } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {FormControl} from '@angular/forms';


/** Basic UX settings. */
@Component({
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss'],
})
export class ExperienceComponent extends BaseComponent implements OnInit {
  @Select(UserSettingsState) public userSettings$: Observable<UserSettingsStateModel>;

  public showVerifyCheckboxPopup: boolean;
  protected timeZoneOffsetLookupTable = {};
  myControl = new FormControl();
  internationalTimeZones: string[] = [];

  localTimeConfig: TimeConfig;
  filteredOptions: Observable<string[]>;

  constructor(
    private readonly store: Store,
    private readonly changelogService: ChangelogService,
    private readonly userTourService: UserTourService,
    private timeService: TimeService,
  ) {
    super();
  }

  /** Angular lifecycle hook. */
  public ngOnInit(): void {
    this.userSettings$.pipe(takeUntil(this.onDestroy$)).subscribe(latest => {
      this.showVerifyCheckboxPopup = latest.showVerifyCheckboxPopup;
      this.localTimeConfig = latest.timeConfiguration;
    });

    this.filteredOptions = this.myControl.valueChanges
    .pipe(
      startWith(''),
      map(value => this._filter(value))
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const timezones = (Intl as any).supportedValuesOf('timeZone');
    this.internationalTimeZones = timezones;

    timezones.forEach(zone => {
      const offset = DateTime.local({ zone: zone }).toFormat('Z');
      this.timeZoneOffsetLookupTable[zone] = offset;
    });
  }

  /** Sets the show verify checkbox popup value in settings. */
  public setShowVerifyCheckboxPopup(): void {
    this.store.dispatch(new ConfigureShowVerifyCheckboxPopup(this.showVerifyCheckboxPopup));
  }

  /** True when the automatic changelog popup is enabled. */
  public get enableAutomaticChangelogPopup(): boolean {
    return !this.changelogService.disableAutomaticPopup;
  }

  /** Sets the state of automatic changelog popups. */
  public set enableAutomaticChangelogPopup(value: boolean) {
    this.changelogService.disableAutomaticPopup = !value;
  }

  /** True when automatic user tours are enabled. */
  public get enableAutomaticTours(): boolean {
    return this.userTourService.enableTours;
  }

  /** Sets the state of automatic user tours. */
  public set enableAutomaticTours(value: boolean) {
    this.userTourService.enableTours = value;
  }

  /**
   Select time zone 
   */
  public selectZone(e: Event): void {
    const selectValue = (e.target as HTMLSelectElement).value;
    const offset = this.timeZoneOffsetLookupTable[selectValue];
    const timeConfig: TimeConfig = { zone: selectValue, offset: offset };
    this.timeService.setLocalTimeConfig(timeConfig);
  }

  /* filter autocomplete options */ 
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.internationalTimeZones.filter(option => option.toLowerCase().includes(filterValue));
  }
}
