import BigNumber from 'bignumber.js';
import { Component, Input } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { GameTitleCodeName } from '@models/enums';
import { GiftResponse } from '@models/gift-response';
import { BackgroundJobService } from '@services/background-job/background-job.service';
import { catchError, delayWhen, map, retryWhen, switchMap, takeUntil } from 'rxjs/operators';
import { NEVER, Observable, of, throwError, timer } from 'rxjs';
import { BackgroundJob, BackgroundJobStatus } from '@models/background-job';
import { LspGroup } from '@models/lsp-group';
import { IdentityResultUnion } from '@models/identity-query.model';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { PlayerUGCItem } from '@models/player-ugc-item';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GiftReason } from '../gift-basket/gift-basket.base.component';
import { HCI } from '@environments/environment';

enum BackgroundJobRetryStatus {
  InProgress = 'Still in progress',
  UnexpectedError = 'Background job failed unexpectedly.',
}

/** The base gift-livery component. */
@Component({
  template: '',
})
export abstract class GiftLiveryBaseComponent<
  IdentityT extends IdentityResultUnion
> extends BaseComponent {
  @Input() public playerIdentities: IdentityT[];
  @Input() public lspGroup: LspGroup;
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

  /** Gets the livery from form controls. */
  public get livery(): PlayerUGCItem {
    return this.formControls.livery.value;
  }

  /** Gets if the livery form control has error. */
  public get liveryHasError(): boolean {
    return this.formControls.livery.hasError('invalidId');
  }

  /** Game title */
  public abstract gameTitle: GameTitleCodeName;

  constructor(private readonly backgroundJobService: BackgroundJobService) {
    super();
  }

  public abstract getLivery$(liveryId: string): Observable<PlayerUGCItem>;
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
    this.getMonitor = new ActionMonitor(this.getMonitor.dispose().label);
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

  /** Sends the gift basket. */
  public sendGiftLivery(): void {
    if (!this.isGiftLiveryReady()) {
      return;
    }

    const sendGift$ = this.sendLiveryRequest$();
    this.postMonitor = new ActionMonitor(this.postMonitor.dispose().label);

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
    return this.formGroup.valid && (hasPlayerIdentities || hasLspGroup);
  }

  /** Resets the UI. */
  public resetTool(clearLivery: boolean = false): void {
    this.giftResponse = undefined;
    this.postMonitor = new ActionMonitor(this.postMonitor.dispose().label);

    if (clearLivery) {
      this.formControls.livery.setValue(null);
      this.formControls.giftReason.setValue('');
      this.formGroup.reset();
    }
  }

  private sendLiveryRequest$(): Observable<BackgroundJob<unknown> | GiftResponse<BigNumber>> {
    if (this.usingPlayerIdentities) {
      return this.giftLiveryToPlayers$(
        this.livery.guidId,
        this.playerIdentities.map(identity => identity.xuid),
        this.formControls.giftReason.value,
      );
    } else {
      return this.giftLiveryToLspGroup$(
        this.livery.guidId,
        this.lspGroup,
        this.formControls.giftReason.value,
      );
    }
  }
}
