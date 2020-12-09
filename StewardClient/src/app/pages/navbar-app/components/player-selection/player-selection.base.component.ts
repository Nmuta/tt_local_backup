import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BaseComponent } from '@components/base-component/base-component.component';
import { Observable } from 'rxjs';
import { delay, takeUntil } from 'rxjs/operators';


/** The shared top-level navbar. */
@Component({
  selector: 'player-selection',
  templateUrl: './player-selection.component.html',
  styleUrls: ['./player-selection.component.scss'],
})
export abstract class PlayerSelectionBaseComponent<T> extends BaseComponent implements OnInit {
  @Input() initPlayerSelectionState: T[] = [];
  @Input() allowT10Id: boolean = true;
  @Input() allowGroup: boolean = true;
  @Output() selectedPlayerIdentitiesEvent = new EventEmitter<T[]>();

  data: string = '';
  playerIds: string[] = [];
  playerIdType: string;
  playerIdentityResults: T[] = [];

  showExpandedTextArea: boolean = false;
  disableValidateButton: boolean = true;
  showGroupDisabledError: boolean = false;

  /** True while waiting on a request. */
  public isLoading = false;
  /** The error received while loading. */
  public loadError: unknown;

  constructor() { 
    super();
  }

  /** Child(title) class should implement. */
  public abstract makeRequestToValidateIds$(playerIds: string[], playerIdType: string): Observable<T[]>;

  /** Initialization hook */
  public ngOnInit(): void {
    this.playerIdentityResults = this.initPlayerSelectionState;
  }
  
  /** Logic when textarea input changes */
  public playerInfoChanged(): void {
    this.playerIds = this.data.split('\n').map(x => x.trim()).filter(x => !!x && x !== '');
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

  /** Checks if all required player selection info is present 
   * to activate the validate button. */
  public checkValidateButtonState(): void {
    this.disableValidateButton = this.playerIds.length <= 0 || !this.playerIdType 
      || this.playerIdType === '' || (!this.allowGroup &&this.playerIds.length > 1);
  }

  /** Validates the provided player ids by getting each player id profile. */
  public validatePlayerIds(): void {
    this.isLoading = true;
    const validateRequest$ = this.makeRequestToValidateIds$(this.playerIds, this.playerIdType);
    validateRequest$.pipe(
        takeUntil(this.onDestroy$),
        delay(3_000)
      ).subscribe(
        response => {
          this.isLoading = false;
          this.playerIdentityResults = response;
          this.selectedPlayerIdentitiesEvent.emit(this.playerIdentityResults);
        },
        error => {
          this.isLoading = false;
          this.loadError = error;
        },
    );
  }

    /** Clears the player identity results. */
    public clearResults(): void {
      this.playerIdentityResults = [];
      this.playerIdType = undefined;
      this.clearInput();
      this.selectedPlayerIdentitiesEvent.emit(this.playerIdentityResults);
    } 
}