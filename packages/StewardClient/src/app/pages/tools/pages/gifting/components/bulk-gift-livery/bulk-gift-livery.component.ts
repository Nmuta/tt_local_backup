import BigNumber from 'bignumber.js';
import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { GameTitle } from '@models/enums';
import { GiftResponse } from '@models/gift-response';
import { BackgroundJobService } from '@services/background-job/background-job.service';
import {
  catchError,
  delayWhen,
  filter,
  map,
  pairwise,
  retryWhen,
  startWith,
  switchMap,
  takeUntil,
} from 'rxjs/operators';
import { NEVER, Observable, of, throwError, timer } from 'rxjs';
import { BackgroundJob, BackgroundJobStatus } from '@models/background-job';
import { LspGroup } from '@models/lsp-group';
import { IdentityResultUnion } from '@models/identity-query.model';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { PlayerUgcItem } from '@models/player-ugc-item';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GiftReason } from '../gift-basket/gift-basket.base.component';
import { HCI } from '@environments/environment';
import { PastableSingleInputComponent } from '@views/pastable-single-input/pastable-single-input.component';
import { DateValidators } from '@shared/validators/date-validators';
import { DateTime } from 'luxon';
import { tryParseBigNumber } from '@helpers/bignumbers';
import { ActivatedRoute } from '@angular/router';
import { ParsePathParamFunctions, PathParams } from '@models/path-params';
import { max, round } from 'lodash';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';
import { BetterSimpleChanges } from '@helpers/simple-changes';
import { SelectLocalizedStringContract } from '@components/localization/select-localized-string/select-localized-string.component';
import { LocalizedStringsMap } from '@models/localization';
import { GuidLikeString } from '@models/extended-types';

enum BackgroundJobRetryStatus {
  InProgress = 'Still in progress',
  UnexpectedError = 'Background job failed unexpectedly.',
}

/** Upstream contract for bulk gift liveries UI. */
export interface BulkGiftLiveryContract {
  gameTitle: GameTitle;

  /** Sets whether the title supports expiration date on gift. */
  allowSettingExpireDate: boolean;

  /**
   * Sets whether the title supports localized title and body ids.
   * If this is set to true, be sure getLocalizedStrings is correctly set up.
   */
  allowSettingLocalizedMessage: boolean;

  /**
   * API for retrieving localized strings.
   */
  getLocalizedStrings$(): Observable<LocalizedStringsMap>;

  /** API for retrieving livery information. */
  getLivery$(liveryId: string): Observable<PlayerUgcItem>;

  /** API for gifting liveries to specific players. */
  giftLiveriesToPlayers$(
    liveryIds: string[],
    xuids: BigNumber[],
    giftReason: string,
    expireAfterDays: BigNumber,
    titleMessageId: GuidLikeString,
    bodyMessageId: GuidLikeString,
  ): Observable<BackgroundJob<unknown>>;

  /** API for gifting liveries to an LSP group. */
  giftLiveriesToLspGroup$(
    liveryIds: string[],
    lspGroup: LspGroup,
    giftReason: string,
    expireAfterDays: BigNumber,
    titleMessageId: GuidLikeString,
    bodyMessageId: GuidLikeString,
  ): Observable<GiftResponse<BigNumber>>;
}

/** The gift-livery component. */
@Component({
  selector: 'bulk-gift-livery',
  templateUrl: './bulk-gift-livery.component.html',
  styleUrls: ['./bulk-gift-livery.component.scss'],
})
export class BulkGiftLiveryComponent<IdentityT extends IdentityResultUnion>
  extends BaseComponent
  implements OnInit, OnChanges
{
  @ViewChild(PastableSingleInputComponent) liveryInput: PastableSingleInputComponent;

  /** Player identities to gift the liveries to. */
  @Input() public playerIdentities: IdentityT[];
  /** Lsp Group to gift the liveries to. */
  @Input() public lspGroup: LspGroup;
  /** Whether component is using player identities. False means LSP group. */
  @Input() public usingPlayerIdentities: boolean;
  /** Service contract for bulk gifting. */
  @Input() public service: BulkGiftLiveryContract;

  public matErrors = { invalidId: 'Invalid Livery ID' };
  public formControls = {
    localizedTitleMessageInfo: new FormControl({}, [Validators.required]),
    localizedBodyMessageInfo: new FormControl({}, [Validators.required]),
    livery: new FormControl(null, [Validators.required]),
    giftReason: new FormControl('', [Validators.required]),
    expireDate: new FormControl(null, [DateValidators.isAfter(DateTime.local().startOf('day'))]),
    hasExpirationDate: new FormControl(false),
  };
  public formGroup = new FormGroup(this.formControls);

  public getMonitor = new ActionMonitor('GET livery');
  public postMonitor = new ActionMonitor('POST gift livery');
  public giftReasons: string[] = [
    GiftReason.CommunityGift,
    GiftReason.LostSave,
    GiftReason.AuctionHouse,
    GiftReason.GameError,
    GiftReason.SaveRollback,
  ];
  public giftResponse: GiftResponse<BigNumber>[];

  public activePermAttribute = PermAttributeName.GiftPlayer;

  /** Gets the liveries to be sent. */
  public liveries: PlayerUgcItem[] = [];

  /** The localized string service. */
  public selectLocalizedStringService: SelectLocalizedStringContract;

  /** Gets if the livery form control has error. */
  public get liveryHasError(): boolean {
    return this.formControls.livery.hasError('invalidId');
  }

  constructor(
    private readonly backgroundJobService: BackgroundJobService,
    private readonly route: ActivatedRoute,
  ) {
    super();
  }

  /** Lifecycle hook. */
  public ngOnInit(): void {
    this.route.queryParams
      .pipe(
        map(() => ParsePathParamFunctions[PathParams.LiveryId](this.route)),
        filter(liveryId => !!liveryId),
        startWith(''),
        pairwise(),
        filter(([prev, cur]) => {
          return prev?.trim() !== cur?.trim();
        }),
        map(([_prev, cur]) => cur),
        takeUntil(this.onDestroy$),
      )
      .subscribe(liveryId => {
        this.resetTool(true);
        this.onLiveryIdChange(liveryId);
      });
  }

  /** Lifecycle hook. */
  public ngOnChanges(changes: BetterSimpleChanges<BulkGiftLiveryComponent<IdentityT>>): void {
    if (changes.service) {
      if (this.service.allowSettingLocalizedMessage) {
        this.selectLocalizedStringService = {
          gameTitle: this.service.gameTitle,
          getLocalizedStrings$: () => this.service.getLocalizedStrings$(),
        };
      } else {
        this.formControls.localizedTitleMessageInfo.removeValidators(Validators.required);
        this.formControls.localizedBodyMessageInfo.removeValidators(Validators.required);
        this.formControls.localizedTitleMessageInfo.updateValueAndValidity();
        this.formControls.localizedBodyMessageInfo.updateValueAndValidity();
      }
    }

    if (changes.usingPlayerIdentities) {
      this.activePermAttribute = this.usingPlayerIdentities
        ? PermAttributeName.GiftPlayer
        : PermAttributeName.GiftGroup;
    }
  }

  /** Filter for the expire date date time component */
  public dateTimeFutureFilter = (input: DateTime | null): boolean => {
    const day = input || DateTime.local().startOf('day');
    return day > DateTime.local().startOf('day');
  };

  /** Called when livery id input has changes. */
  public onLiveryIdChange(input: string): void {
    this.getMonitor = this.getMonitor.repeat();
    this.formControls.livery.reset();
    this.formControls.livery.setErrors({});
    if (!input) return;

    const getLivery$ = this.service.getLivery$(input);
    getLivery$
      .pipe(
        this.getMonitor.monitorSingleFire(),
        catchError(_error => {
          this.formControls.livery.setErrors({
            invalidId: true,
          });
          return NEVER;
        }),
        takeUntil(this.onDestroy$),
      )
      .subscribe(livery => {
        this.liveries.unshift(livery);
        this.liveryInput.clearInput();
      });
  }

  /** Sends the gift basket. */
  public sendGiftLivery(): void {
    if (!this.isGiftLiveryReady()) {
      return;
    }

    const sendGift$ = this.sendLiveryRequest$();
    this.postMonitor = this.postMonitor.repeat();

    sendGift$
      .pipe(
        switchMap(response => {
          // If response is a background job, we must wait for it to complete.
          if (!!(response as BackgroundJob<unknown>)?.jobId) {
            return this.waitForBackgroundJobToComplete(response as BackgroundJob<unknown>);
          }

          return of([response as GiftResponse<BigNumber>]);
        }),
        this.postMonitor.monitorSingleFire(),
        takeUntil(this.onDestroy$),
      )
      .subscribe(response => {
        this.giftResponse = response;
      });
  }

  /** Remove the livery from the list of liveries to be gifted. */
  public removeLivery(livery: PlayerUgcItem): void {
    const index: number = this.liveries.indexOf(livery);
    this.liveries.splice(index, 1);
  }

  /** Waits for a background job to complete. */
  public waitForBackgroundJobToComplete(
    job: BackgroundJob<unknown>,
  ): Observable<GiftResponse<BigNumber>[]> {
    return this.backgroundJobService.getBackgroundJob$<GiftResponse<BigNumber>[]>(job.jobId).pipe(
      map(job => {
        let returnValue: GiftResponse<BigNumber>[] = [];
        switch (job.status) {
          case BackgroundJobStatus.Completed:
          case BackgroundJobStatus.CompletedWithErrors:
            returnValue = Array.isArray(job.result) ? job.result : [job.result];
            break;
          case BackgroundJobStatus.InProgress:
            throw new Error(BackgroundJobRetryStatus.InProgress);
          default:
            throw new Error(BackgroundJobRetryStatus.UnexpectedError);
        }

        return returnValue;
      }),
      retryWhen(errors$ =>
        errors$.pipe(
          switchMap((error: Error) => {
            if (error.message === BackgroundJobRetryStatus.UnexpectedError) {
              return throwError(error);
            }

            return of(error);
          }),
          delayWhen(() => timer(HCI.AutoRetryMillis)),
        ),
      ),
      takeUntil(this.onDestroy$),
    );
  }

  /** Returns true if all required info is valid to send a gift livery. */
  public isGiftLiveryReady(): boolean {
    const hasPlayerIdentities = this.usingPlayerIdentities && this.playerIdentities?.length > 0;
    const hasLspGroup = !this.usingPlayerIdentities && !!this.lspGroup;
    return (
      this.liveries.length > 0 &&
      !this.formControls.giftReason.errors &&
      (!this.formControls.hasExpirationDate.value || !this.formControls.expireDate.errors) &&
      (hasPlayerIdentities || hasLspGroup)
    );
  }

  /** Get the number of days between right now and the selected date */
  public getExpireDateInDays(): BigNumber {
    if (!this.formControls.hasExpirationDate.value) {
      return new BigNumber(0);
    }
    let numberOfDays = round(
      DateTime.fromJSDate(this.formControls.expireDate.value).diffNow('days').days,
    );
    // Replace negative values by 0 to avoid sending negative values to API which takes a uint
    numberOfDays = max([0, numberOfDays]);
    return tryParseBigNumber(numberOfDays).integerValue();
  }

  /** Add a default expiration the first time the hasExpiration checkbox is checked */
  public initExpireDate(): void {
    if (!this.formControls.expireDate.value) {
      this.formControls.expireDate.setValue(DateTime.local().plus({ days: 7 }));
    }
  }

  /** Resets the UI. */
  public resetTool(clearLivery: boolean = false): void {
    this.giftResponse = undefined;
    this.postMonitor = this.postMonitor.repeat();

    if (clearLivery) {
      this.formControls.livery.setValue(null);
      this.formControls.giftReason.setValue('');
      this.liveries = [];
      this.formGroup.reset();
    }
  }

  private sendLiveryRequest$(): Observable<BackgroundJob<unknown> | GiftResponse<BigNumber>> {
    if (this.usingPlayerIdentities) {
      return this.service.giftLiveriesToPlayers$(
        this.liveries.map(x => x.id),
        this.playerIdentities.map(identity => identity.xuid),
        this.formControls.giftReason.value,
        this.getExpireDateInDays(),
        this.formControls.localizedTitleMessageInfo.value.id,
        this.formControls.localizedBodyMessageInfo.value.id,
      );
    } else {
      return this.service.giftLiveriesToLspGroup$(
        this.liveries.map(x => x.id),
        this.lspGroup,
        this.formControls.giftReason.value,
        this.getExpireDateInDays(),
        this.formControls.localizedTitleMessageInfo.value.id,
        this.formControls.localizedBodyMessageInfo.value.id,
      );
    }
  }
}
