import BigNumber from 'bignumber.js';
import { Component, Input, ViewChild } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { GameTitle } from '@models/enums';
import { GiftResponse } from '@models/gift-response';
import { BackgroundJobService } from '@services/background-job/background-job.service';
import { catchError, delayWhen, map, retryWhen, switchMap, takeUntil } from 'rxjs/operators';
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

enum BackgroundJobRetryStatus {
  InProgress = 'Still in progress',
  UnexpectedError = 'Background job failed unexpectedly.',
}

/** Upstream contract for bulk gift liveries UI. */
export interface BulkGiftLiveryContract {
  gameTitle: GameTitle;

  /** API for retrieving livery information. */
  getLivery$(liveryId: string): Observable<PlayerUgcItem>;

  /** API for gifting liveries to specific players. */
  giftLiveriesToPlayers$(
    liveryIds: string[],
    xuids: BigNumber[],
    giftReason: string,
  ): Observable<BackgroundJob<unknown>>;

  /** API for gifting liveries to an LSP group. */
  giftLiveriesToLspGroup$(
    liveryIds: string[],
    lspGroup: LspGroup,
    giftReason: string,
  ): Observable<GiftResponse<BigNumber>>;
}

/** The base gift-livery component. */
@Component({
  selector: 'bulk-gift-livery',
  templateUrl: './bulk-gift-livery.component.html',
  styleUrls: ['./bulk-gift-livery.component.scss'],
})
export class BulkGiftLiveryBaseComponent<
  IdentityT extends IdentityResultUnion,
> extends BaseComponent {
  @ViewChild(PastableSingleInputComponent) liveryInput: PastableSingleInputComponent;

  @Input() public playerIdentities: IdentityT[];
  @Input() public lspGroup: LspGroup;
  @Input() public usingPlayerIdentities: boolean;
  @Input() public service: BulkGiftLiveryContract;

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

  /** Gets the liveries to be sent. */
  public liveries: PlayerUgcItem[] = [];

  /** Gets if the livery form control has error. */
  public get liveryHasError(): boolean {
    return this.formControls.livery.hasError('invalidId');
  }

  constructor(private readonly backgroundJobService: BackgroundJobService) {
    super();
  }

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
      (hasPlayerIdentities || hasLspGroup)
    );
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
      );
    } else {
      return this.service.giftLiveriesToLspGroup$(
        this.liveries.map(x => x.id),
        this.lspGroup,
        this.formControls.giftReason.value,
      );
    }
  }
}
