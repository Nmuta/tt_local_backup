import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatTableDataSource } from '@angular/material/table';
import { BaseComponent } from '@components/base-component/base.component';
import { CreateLocalizedStringContract } from '@components/localization/create-localized-string/create-localized-string.component';
import { SelectLocalizedStringContract } from '@components/localization/select-localized-string/select-localized-string.component';
import { GameTitle } from '@models/enums';
import { PullRequest, PullRequestSubject } from '@models/git-operation';
import { LocalizedStringData, LocalizedStringsMap } from '@models/localization';
import { MessageOfTheDay, FriendlyNameMap } from '@models/message-of-the-day';
import { SteelheadGitOperationService } from '@services/api-v2/steelhead/git-operation/steelhead-git-operation.service';
import { SteelheadLocalizationService } from '@services/api-v2/steelhead/localization/steelhead-localization.service';
import { SteelheadMessageOfTheDayService } from '@services/api-v2/steelhead/message-of-the-day/steelhead-message-of-the-day.service';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { Observable, takeUntil } from 'rxjs';

type PullRequestTableData = PullRequest & {
  monitor: ActionMonitor;
};

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
  public submitMotdMonitor = new ActionMonitor('POST Message Of The Day');
  public getPullRequests = new ActionMonitor('GET Pull Requests');
  public localizationCreationServiceContract: CreateLocalizedStringContract;
  public localizationSelectServiceContract: SelectLocalizedStringContract;
  public friendlyNameList: FriendlyNameMap;
  public isInEditMode: boolean = false;
  public currentMessageOfTheDay: MessageOfTheDay;
  public pullRequestUrl: string;
  public existingPullRequestList = new MatTableDataSource<PullRequestTableData>();
  public columnsToDisplay = ['title', 'creationDate', 'actions'];

  public formControls = {
    selectedMessageOfTheDay: new FormControl(null, [Validators.required]),
    localizedTitleHeader: new FormControl({ value: {}, disabled: true }, [Validators.required]),
    date: new FormControl({}, [Validators.required]),
    localizedContentHeader: new FormControl({ value: {}, disabled: true }),
    localizedContentBody: new FormControl({ value: {}, disabled: true }, [Validators.required]),
    contentImagePath: new FormControl(null, [Validators.required]),
  };

  public formGroup: FormGroup = new FormGroup(this.formControls);

  public readonly permAttribute = PermAttributeName.UpdateMessageOfTheDay;

  constructor(
    steelheadLocalizationService: SteelheadLocalizationService,
    private readonly steelheadMessageOfTheDayService: SteelheadMessageOfTheDayService,
    private readonly steelheadGitOperationService: SteelheadGitOperationService,
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
      .subscribe(friendlyNameMap => {
        this.friendlyNameList = friendlyNameMap;
      });

    this.getActivePullRequests();
  }

  /** Clears the content image path input */
  public clearContentImagePath(): void {
    this.formControls.contentImagePath.setValue(null);
  }

  /** Loads the selected Message Of The Day data. */
  public messageOfTheDayChanged(): void {
    this.getDetailActionMonitor = this.getDetailActionMonitor.repeat();
    this.isInEditMode = false;
    this.verifyCheckbox.checked = false;

    this.steelheadMessageOfTheDayService
      .getMessageOfTheDayDetail$(this.formControls.selectedMessageOfTheDay.value)
      .pipe(this.getDetailActionMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(messageOfTheDayDetail => {
        this.currentMessageOfTheDay = messageOfTheDayDetail;
        this.setFields(messageOfTheDayDetail);
      });
  }

  /** Remove changes made to the message of the day and bring back the actual values. */
  public revertEntryEdit(): void {
    this.isInEditMode = false;
    this.verifyCheckbox.checked = false;

    this.formControls.localizedTitleHeader.disable();
    this.formControls.localizedContentHeader.disable();
    this.formControls.localizedContentBody.disable();

    this.setFields(this.currentMessageOfTheDay);
  }

  /** Submit message of the day modification. */
  public submitChanges(): void {
    this.submitMotdMonitor = this.submitMotdMonitor.repeat();

    this.isInEditMode = false;
    this.verifyCheckbox.checked = false;

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
      .pipe(this.submitMotdMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(pullrequest => {
        this.pullRequestUrl = pullrequest.webUrl;
        this.isInEditMode = false;
        this.verifyCheckbox.checked = false;
        this.formControls.localizedTitleHeader.disable();
        this.formControls.localizedContentHeader.disable();
        this.formControls.localizedContentBody.disable();
        this.existingPullRequestList.data.unshift({
          ...pullrequest,
          monitor: new ActionMonitor(`Abandon pull request: ${pullrequest.id}`),
        } as PullRequestTableData);
        this.existingPullRequestList._updateChangeSubscription();
      });
  }

  /** Toggle the form to edit mode, enabling all the fields. */
  public toggleEditMode(): void {
    this.isInEditMode = true;
    this.formControls.localizedTitleHeader.enable();
    this.formControls.localizedContentHeader.enable();
    this.formControls.localizedContentBody.enable();
    this.pullRequestUrl = '';
  }

  /** Send a request to github to abandon a Pull Request. */
  public abandonPullRequest(entry: PullRequestTableData): void {
    entry.monitor = entry.monitor.repeat();
    this.steelheadGitOperationService
      .abandonPullRequest$(entry.id)
      .pipe(entry.monitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(() => {
        const index = this.existingPullRequestList.data.indexOf(entry);
        this.existingPullRequestList.data.splice(index, 1);
        this.existingPullRequestList._updateChangeSubscription();
      });
  }

  /** Get and display the current active pull request. */
  private getActivePullRequests(): void {
    this.getPullRequests = this.getPullRequests.repeat();
    this.steelheadGitOperationService
      .getActivePullRequests$(PullRequestSubject.MessageOfTheDay)
      .pipe(this.getPullRequests.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(result => {
        this.existingPullRequestList.data = result.map(pullrequest => {
          return {
            ...pullrequest,
            monitor: new ActionMonitor(`Abandon pull request: ${pullrequest.id}`),
          } as PullRequestTableData;
        });
      });
  }

  /** Set form fields using the MessageOfTheDay parameter. */
  private setFields(messageOfTheDayDetail: MessageOfTheDay): void {
    this.formControls.contentImagePath.setValue(messageOfTheDayDetail.contentImagePath);
    this.formControls.date.setValue(messageOfTheDayDetail.date);

    // Localization data
    this.formControls.localizedTitleHeader.reset();
    this.formControls.localizedContentHeader.reset();
    this.formControls.localizedContentBody.reset();

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
  }
}
