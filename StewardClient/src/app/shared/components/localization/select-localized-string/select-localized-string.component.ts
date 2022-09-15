import { AfterViewInit, Component, Input } from '@angular/core';
import { MatChipListChange } from '@angular/material/chips';
import { MatSelectChange } from '@angular/material/select';
import { BaseComponent } from '@components/base-component/base.component';
import { GameTitle } from '@models/enums';
import { GuidLikeString } from '@models/extended-types';
import { LocalizedString, LocalizedStringCollection } from '@models/localization';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { EMPTY, Observable, Subject } from 'rxjs';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';


export interface SelectLocalizedStringContract {
  gameTitle: GameTitle;
  getLocalizedStrings$(): Observable<LocalizedStringCollection>;
}

export interface LocalizationOptions {
  text: string;
  id: GuidLikeString;
}

/** Displays the value sent on `input` as a json blob. */
@Component({
  selector: 'select-localized-string',
  templateUrl: './select-localized-string.component.html',
  styleUrls: ['./select-localized-string.component.scss'],
})
export class SelectLocalizedStringComponent extends BaseComponent implements AfterViewInit{
  @Input() service: SelectLocalizedStringContract

  public localizedStrings: LocalizedStringCollection = [];
  public localizedStringDetails: LocalizationOptions[] = [];

  public selectedLocalizedStringId: GuidLikeString = null;
  public selectedLocalizedStringCollection: LocalizedString[] = [];
  public selectedLanguageLocalizedString: LocalizedString = null;

  public getMonitor = new ActionMonitor('GET localized strings');
  public readonly messageMaxLength: number = 512;

  private readonly getLocalizedStrings$ = new Subject<void>();

  /** Lifecycle hook */
  public ngAfterViewInit(): void {
    this.getLocalizedStrings$
    .pipe(
      tap(() => (this.getMonitor = this.getMonitor.repeat())),
      switchMap(() => {
        this.localizedStrings = [];
        this.selectedLocalizedStringId = null;
        this.selectedLocalizedStringCollection = [];
        return this.service.getLocalizedStrings$().pipe(
          this.getMonitor.monitorSingleFire(),
          catchError(() => {
            this.localizedStrings = [];
            this.selectedLocalizedStringId = null;
            this.selectedLocalizedStringCollection = [];
            return EMPTY;
          }),
        );
      }),
      takeUntil(this.onDestroy$),
    )
    .subscribe(returnedLocalizedStrings => {
      this.localizedStrings = returnedLocalizedStrings;
      const keys = Object.keys(this.localizedStrings);
      this.localizedStringDetails = keys.map(x => {
        const record = this.localizedStrings[x].find((record: LocalizedString)  => record.languageCode === 'en-US')
        return {
          id: x,
          text: record.message,
        }
      })
    });

    this.getLocalizedStrings$.next();
  }

  /** Handles selection change event for localized string dropdown */
  onLocalizedStringSelect(event: MatSelectChange){
    const oldValue = this.selectedLocalizedStringId
    this.selectedLocalizedStringId = event.value;
    if(oldValue !== this.selectedLocalizedStringId)
    {
      this.selectedLanguageLocalizedString = null
    }

    this.selectedLocalizedStringCollection = this.localizedStrings[this.selectedLocalizedStringId].sort(function(a,b){return b.translated-a.translated});
  }

  /** Handles selection change event for language chip list */
  onLanguageChipSelect(change: MatChipListChange): void {
    if (change.value) {
      this.selectedLanguageLocalizedString = this.selectedLocalizedStringCollection.find(localizedString => localizedString.languageCode == change.value.languageCode);
    }
    else {
      this.selectedLanguageLocalizedString = null;
    }
  }
}