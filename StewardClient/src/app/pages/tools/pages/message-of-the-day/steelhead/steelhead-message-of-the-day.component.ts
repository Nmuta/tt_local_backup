import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { BaseComponent } from '@components/base-component/base.component';
import { CreateLocalizedStringContract } from '@components/localization/create-localized-string/create-localized-string.component';
import { SelectLocalizedStringContract } from '@components/localization/select-localized-string/select-localized-string.component';
import { GameTitle } from '@models/enums';
import { LocalizedStringData, LocalizedStringsMap } from '@models/localization';
import { MessageOfTheDay, MessagesOfTheDayMap } from '@models/message-of-the-day';
import { SteelheadLocalizationService } from '@services/api-v2/steelhead/localization/steelhead-localization.service';
import { SteelheadMessageOfTheDayService } from '@services/api-v2/steelhead/message-of-the-day/steelhead-message-of-the-day.service';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { Observable, takeUntil } from 'rxjs';

/** The Steelhead message of the day page. */
@Component({
  templateUrl: './steelhead-message-of-the-day.component.html',
  styleUrls: ['./steelhead-message-of-the-day.component.scss'],
})
export class SteelheadMessageOfTheDayComponent extends BaseComponent implements OnInit {
  @ViewChild(MatCheckbox) verifyCheckbox: MatCheckbox;

  public gameTitle = GameTitle.FM8;
  public getListActionMonitor = new ActionMonitor('GET Message Of The Day list');
  public getDetailActionMonitor = new ActionMonitor('GET Message Of The Day detail');
  public localizationCreationServiceContract: CreateLocalizedStringContract;
  public localizationSelectServiceContract: SelectLocalizedStringContract;
  public messageOfTheDayList: MessagesOfTheDayMap;
  public isInEditMode: boolean = false;
  public currentMessageOfTheDay: MessageOfTheDay;

  public formControls = {
    selectedMessageOfTheDay: new FormControl(null, [Validators.required]),
    localizedTitleHeader: new FormControl({ value: {}, disabled: true }, [Validators.required]),
    date: new FormControl({}, [Validators.required]),
    localizedContentHeader: new FormControl({ value: {}, disabled: true }),
    localizedContentBody: new FormControl({ value: {}, disabled: true }, [Validators.required]),
    contentImagePath: new FormControl(null, [Validators.required]),
  };

  public formGroup: FormGroup = new FormGroup(this.formControls);

  constructor(
    steelheadLocalizationService: SteelheadLocalizationService,
    private readonly steelheadMessageOfTheDayService: SteelheadMessageOfTheDayService,
  ) {
    super();

    this.localizationCreationServiceContract = {
      gameTitle: this.gameTitle,
      postStringForLocalization$(localizedStringData: LocalizedStringData): Observable<void> {
        return steelheadLocalizationService.postLocalizedString$(localizedStringData);
      },
    };

    this.localizationSelectServiceContract = {
      gameTitle: this.gameTitle,
      getLocalizedStrings$(): Observable<LocalizedStringsMap> {
        return steelheadLocalizationService.getLocalizedStrings$();
      },
    };
  }

  /** Angular lifecycle hook. */
  public ngOnInit(): void {
    this.steelheadMessageOfTheDayService
      .getMessagesOfTheDay$()
      .pipe(this.getListActionMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(motdMap => {
        this.messageOfTheDayList = motdMap;
      });
  }

  /** Clears the content image path input */
  public clearContentImagePath(): void {
    this.formControls.contentImagePath.setValue(null);
  }

  /** Loads the selected Message Of The Day data. */
  public messageOfTheDayChanged(): void {
    this.isInEditMode = false;
    this.verifyCheckbox.checked = false;

    this.steelheadMessageOfTheDayService
      .getMessageOfTheDayDetail$(this.formControls.selectedMessageOfTheDay.value)
      .pipe(this.getDetailActionMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(messageOfTheDayDetail => {
        this.currentMessageOfTheDay = messageOfTheDayDetail;
        this.formControls.contentImagePath.setValue(messageOfTheDayDetail.contentImagePath);
        this.formControls.date.setValue(messageOfTheDayDetail.date);
        // Localization data
        if (messageOfTheDayDetail.titleHeader.locref) {
          this.formControls.localizedTitleHeader.setValue({
            id: messageOfTheDayDetail.titleHeader.locref,
          });
        }
        if (messageOfTheDayDetail.contentHeader.locref) {
          this.formControls.localizedContentHeader.setValue({
            id: messageOfTheDayDetail.contentHeader.locref,
          });
        }
        if (messageOfTheDayDetail.contentBody.locref) {
          this.formControls.localizedContentBody.setValue({
            id: messageOfTheDayDetail.contentBody.locref,
          });
        }
      });
  }

  /** Submit message of the day modification. */
  public submitChanges(): void {
    this.currentMessageOfTheDay.contentImagePath = this.formControls.contentImagePath.value;
    this.currentMessageOfTheDay.date = this.formControls.date.value;
    // Localization data
    this.currentMessageOfTheDay.titleHeader.locref =
      this.formControls.localizedTitleHeader.value?.id;
    this.currentMessageOfTheDay.contentHeader.locref =
      this.formControls.localizedContentHeader.value?.id;
    this.currentMessageOfTheDay.contentBody.locref =
      this.formControls.localizedContentBody.value?.id;

    this.steelheadMessageOfTheDayService
      .submitModification$(
        this.formControls.selectedMessageOfTheDay.value,
        this.currentMessageOfTheDay,
      )
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.isInEditMode = false;
        this.verifyCheckbox.checked = false;
        this.formControls.localizedTitleHeader.disable();
        this.formControls.localizedContentHeader.disable();
        this.formControls.localizedContentBody.disable();
      });
  }

  /** Toggle the form to edit mode, enabling all the fields. */
  public toggleEditMode(): void {
    this.isInEditMode = true;
    this.formControls.localizedTitleHeader.enable();
    this.formControls.localizedContentHeader.enable();
    this.formControls.localizedContentBody.enable();
  }
}
