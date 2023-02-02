import BigNumber from 'bignumber.js';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { GameTitle } from '@models/enums';
import { GiftResponse } from '@models/gift-response';
import { BackgroundJobService } from '@services/background-job/background-job.service';
import {
  catchError,
  delayWhen,
  filter,
  map,
  retryWhen,
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
import { ActivatedRoute } from '@angular/router';
import { ParsePathParamFunctions, PathParams } from '@models/path-params';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';
import { BetterSimpleChanges } from '@helpers/simple-changes';

enum BackgroundJobRetryStatus {
  InProgress = 'Still in progress',
  UnexpectedError = 'Background job failed unexpectedly.',
}

/** The base gift-livery component. */
@Component({
  template: '',
})
export abstract class GiftLiveryBaseComponent<IdentityT extends IdentityResultUnion>
  extends BaseComponent
  implements OnInit, OnChanges
{
  /** Player identities to gift the livery to. */
  @Input() public playerIdentities: IdentityT[];
  /** Lsp Group to gift the livery to. */
  @Input() public lspGroup: LspGroup;
  /** Whether component is using player identities. False means LSP group. */
  @Input() public usingPlayerIdentities: boolean;

  public matErrors = { invalidId: 'Invalid Livery ID' };
  public formControls = {
    livery: new FormControl(null, [Validators.required]),
    giftReason: new FormControl('', [Validators.required]),
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

  /** Gets the livery from form controls. */
  public get livery(): PlayerUgcItem {
    return this.formControls.livery.value;
  }

  /** Gets if the livery form control has error. */
  public get liveryHasError(): boolean {
    return this.formControls.livery.hasError('invalidId');
  }

  /** Game title */
  public abstract gameTitle: GameTitle;

  constructor(
    private readonly backgroundJobService: BackgroundJobService,
    private readonly route: ActivatedRoute,
  ) {
    super();
  }

  public abstract getLivery$(liveryId: string): Observable<PlayerUgcItem>;
  public abstract giftLiveryToPlayers$(
    liveryId: string,
    xuids: BigNumber[],
    giftReason: string,
  ): Observable<BackgroundJob<unknown>>;
  public abstract giftLiveryToLspGroup$(
    liveryId: string,
    lspGroup: LspGroup,
    giftReason: string,
  ): Observable<GiftResponse<BigNumber>>;

  /** Called when livery id input has changes. */
  public onLiveryIdChange(input: string): void {
    this.getMonitor = this.getMonitor.repeat();
    this.formControls.livery.reset();
    this.formControls.livery.setErrors({});
    if (!input) return;

    const getLivery$ = this.getLivery$(input);
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
        this.formControls.livery.setValue(livery);
      });
  }

  /** Lifecycle hook. */
  public ngOnInit(): void {
    this.route.queryParams
      .pipe(
        map(() => ParsePathParamFunctions[PathParams.LiveryId](this.route)),
        filter(liveryId => !!liveryId),
        takeUntil(this.onDestroy$),
      )
      .subscribe(liveryId => {
        this.resetTool(true);
        this.onLiveryIdChange(liveryId);
      });
  }

  /** Lifecycle hook. */
  public ngOnChanges(changes: BetterSimpleChanges<GiftLiveryBaseComponent<IdentityT>>): void {
    if (changes.usingPlayerIdentities) {
      this.activePermAttribute = this.usingPlayerIdentities
        ? PermAttributeName.GiftPlayer
        : PermAttributeName.GiftGroup;
    }
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
            if (error.message !== BackgroundJobRetryStatus.InProgress) {
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
    return this.formGroup.valid && (hasPlayerIdentities || hasLspGroup);
  }

  /** Resets the UI. */
  public resetTool(clearLivery: boolean = false): void {
    this.giftResponse = undefined;
    this.postMonitor = this.postMonitor.repeat();

    if (clearLivery) {
      this.formControls.livery.setValue(null);
      this.formControls.giftReason.setValue('');
      this.formGroup.reset();
    }
  }

  private sendLiveryRequest$(): Observable<BackgroundJob<unknown> | GiftResponse<BigNumber>> {
    if (this.usingPlayerIdentities) {
      return this.giftLiveryToPlayers$(
        this.livery.id,
        this.playerIdentities.map(identity => identity.xuid),
        this.formControls.giftReason.value,
      );
    } else {
      return this.giftLiveryToLspGroup$(
        this.livery.id,
        this.lspGroup,
        this.formControls.giftReason.value,
      );
    }
  }
}
