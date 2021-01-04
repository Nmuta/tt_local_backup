import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from '@components/base-component/base-component.component';
import { Observable } from 'rxjs';
import { delay, takeUntil } from 'rxjs/operators';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { IdentityResultAlpha, IdentityResultBeta } from '@models/identity-query.model';
import { ControlValueAccessor } from '@angular/forms';

type IdentityResultUnion = IdentityResultAlpha | IdentityResultBeta;

/** The shared top-level navbar. */
@Component({
  selector: 'player-selection',
  templateUrl: './player-selection.component.html',
  styleUrls: ['./player-selection.component.scss'],
})
export abstract class PlayerSelectionBaseComponent<T extends IdentityResultUnion>
  extends BaseComponent
  implements OnInit, ControlValueAccessor {
  @Input() allowT10Id: boolean = true;
  @Input() allowGroup: boolean = true;

  public playerIdentities: T[] = [];

  /** Close icon */
  public closeIcon = faTimesCircle;

  /** ngModel associated to the textarea input. */
  data: string = '';
  /** Array of player ids populated from the textarea input. */
  playerIds: string[] = [];
  /** The player id type (gamertag|xuid|t10id) populated by the button toggle. */
  playerIdType: string;
  /** Player identity results that come from api request. */
  playerIdentityResults: T[] = [];
  /** Number of player identity lookup errors. */
  numPlayerIdentityErrorResults: number;

  /** Boolean whether card content should be collapsed. */
  contentCollapseState: boolean = false;
  /** Boolean whether textarea in UI should be expanded.  */
  showExpandedTextArea: boolean = false;
  /** Boolean whether the validate button should be disabled. */
  disableValidateButton: boolean = true;
  /** Boolean whether UI should show group disabled error. */
  showGroupDisabledError: boolean = false;

  /** True while waiting on a request. */
  public isLoading = false;
  /** The error received while loading. */
  public loadError: unknown;

  constructor() {
    super();
  }

  /** Child(title) class should implement. */
  public abstract makeRequestToValidateIds$(
    playerIds: string[],
    playerIdType: string,
  ): Observable<T[]>;

  /** Initialization hook */
  public ngOnInit(): void {
    this.checkPlayerIdentityResultsForErrors();
  }
  
  /** Form control hook. */
  public writeValue(obj: T[]): void {
    this.playerIdentities = obj;
  }
  
  /** Form control hook. */
  public registerOnChange(fn: (value: T[]) => void): void {
    debugger;
    this.onChangeFunction = fn;
  }
  
  /** Form control hook. */
  public registerOnTouched(_fn: unknown): void {
    /** empty */
  }
  
  /** Form control hook. */
  public setDisabledState?(_isDisabled: boolean): void {
    throw new Error('Method not implemented.');
  }

  /** Logic when textarea input changes */
  public playerInfoChanged(): void {
    // Grab ids from ngModel data
    this.playerIds = this.data
      .split('\n')
      .map(x => x.trim())
      .filter(x => !!x && x !== '');

    // Handle UI elements
    this.showExpandedTextArea = this.allowGroup && this.playerIds.length > 1;
    this.showGroupDisabledError = !this.allowGroup && this.playerIds.length > 1;
    this.checkValidateButtonState();
  }

  /** Button toggle change event for player id types. */
  public playerIdTypeChange(idType: string): void {
    this.playerIdType = idType;
    this.checkValidateButtonState();
  }

  /** Clears the current player id input. */
  public clearInput(): void {
    this.data = '';
    this.showGroupDisabledError = false;
    this.playerInfoChanged();
  }

  /** Clears the player identity results. */
  public clearResults(): void {
    this.playerIdentities = [];
    this.playerIdType = undefined;
    this.clearInput();
    this.checkPlayerIdentityResultsForErrors();
    this.emitPlayerIdentities();
  }

  /** Checks if all required player selection info is present
   * to activate the validate button. */
  public checkValidateButtonState(): void {
    this.disableValidateButton =
      this.playerIds.length <= 0 ||
      !this.playerIdType ||
      this.playerIdType === '' ||
      (!this.allowGroup && this.playerIds.length > 1);
  }

  /** Validates the provided player ids by getting each player id profile. */
  public validatePlayerIds(): void {
    this.isLoading = true;
    const validateRequest$ = this.makeRequestToValidateIds$(this.playerIds, this.playerIdType);
    validateRequest$.pipe(takeUntil(this.onDestroy$), delay(3_000)).subscribe(
      response => {
        this.isLoading = false;
        this.playerIdentities = response.sort((a, b) =>
          a['error'] === b['error'] ? 0 : a['error'] ? -1 : 1,
        );
        this.checkPlayerIdentityResultsForErrors();
        this.emitPlayerIdentities();
      },
      error => {
        this.isLoading = false;
        this.loadError = error;
      },
    );
  }

  /** Removed player at given index from the results list. */
  public removePlayerFromList(index: number): void {
    this.playerIdentities.splice(index, 1);
    this.checkPlayerIdentityResultsForErrors();
    this.emitPlayerIdentities();

    if (this.playerIdentities.length <= 0) {
      this.clearResults();
    }
  }

  /** Sets the number of player identity results that are errors. */
  public checkPlayerIdentityResultsForErrors(): void {
    this.numPlayerIdentityErrorResults = this.playerIdentities.filter(x => x['error']).length;
    this.contentCollapseState =
      this.playerIdentities.length > 0 && this.numPlayerIdentityErrorResults <= 0;
  }

  /** Logic deciding if we should emit the player identities to its listeners. */
  public emitPlayerIdentities(): void {
    debugger;
    this.onChangeFunction(this.playerIdentities);
  }

  private onChangeFunction = (_value: T[]) => { /* empty */ };
}
