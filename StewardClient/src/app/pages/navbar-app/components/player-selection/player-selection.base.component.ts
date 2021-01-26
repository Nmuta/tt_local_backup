import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { BaseComponent } from '@components/base-component/base-component.component';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { faTimesCircle, faTimes, faCopy } from '@fortawesome/free-solid-svg-icons';
import { IdentityResultAlpha, IdentityResultBeta } from '@models/identity-query.model';
import { ControlValueAccessor } from '@angular/forms';
import { GameTitleCodeName } from '@models/enums';
import { isEqual } from 'lodash';
import { MatChipListChange } from '@angular/material/chips';

type IdentityResultsIntersection = IdentityResultAlpha & IdentityResultBeta;
type IdentityResultUnion = IdentityResultAlpha | IdentityResultBeta;

/** The shared top-level navbar. */
@Component({
  template: '',
})
export abstract class PlayerSelectionBaseComponent<T extends IdentityResultUnion>
  extends BaseComponent
  implements ControlValueAccessor {
  @Input() allowT10Id: boolean = true;
  @Input() allowGroup: boolean = true;
  @Output() public selectionChange = new EventEmitter<T>();
  @Output() playerIdentitySelectedEvent = new EventEmitter<T>();

  public playersSelector = new FormControl('', [this.ValidateGroupSelection.bind(this)]);

  /** The player identites that are given to parent components for use */
  public playerIdentities: T[] = [];
  /** The player identities in a format the template can consume. */
  public get playerIdentitiesFull(): IdentityResultsIntersection[] {
    return (this.playerIdentities as unknown) as IdentityResultsIntersection[];
  }
  /** The identity that has been clicked */
  public selectedPlayerIdentity: T = null;

  /** FA icons */
  public closeIcon = faTimesCircle;
  public exitIcon = faTimes;
  public copyToClipboard = faCopy;

  /** ngModel associated to the textarea input. */
  public data: string = '';
  /** Array of player ids populated from the textarea input. */
  playerIds: string[] = [];
  /** The player id type (gamertag|xuid|t10Id) populated by the button toggle. */
  playerIdType: string = 'gamertag';
  /** Boolean whether textarea in UI should be expanded.  */
  public showExpandedTextArea: boolean = false;
  /** Boolean whether the validate button should be disabled. */
  public disableValidateButton: boolean = true;
  /** Boolean whether UI should show group disabled error. */
  public showGroupDisabledError: boolean = false;

  /** True while waiting on a request. */
  public isLoading = false;
  /** The error received while loading. */
  public loadError: unknown;

  /** Game title */
  public abstract title: GameTitleCodeName;

  /** Child(title) class should implement. */
  public abstract makeRequestToValidateIds$(
    playerIds: string[],
    playerIdType: string,
  ): Observable<T[]>;

  /** Custom form validator */
  public ValidateGroupSelection(control: AbstractControl): { [key: string]: boolean } | null {
    if (!!control.value && !this.allowGroup && this.playerIds.length > 1) {
      return { groupSelectionInvalid: true };
    }

    return null;
  }

  /** Form control hook. */
  public writeValue(obj: T[]): void {
    this.playerIdentities = obj;
  }

  /** Form control hook. */
  public registerOnChange(fn: (value: T[]) => void): void {
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
    this.clearInput();
    this.emitPlayerIdentities();
    this.selectedPlayerIdentity = null;
    this.emitSelectedPlayerIdentity(null);
  }

  /** Checks if all required player selection info is present
   * to activate the validate button. */
  public checkValidateButtonState(): void {
    this.disableValidateButton =
      this.playerIds.length <= 0 || (!this.allowGroup && this.playerIds.length > 1);
  }

  /** Validates the provided player ids by getting each player id profile. */
  public validatePlayerIds(): void {
    this.isLoading = true;
    const validateRequest$ = this.makeRequestToValidateIds$(this.playerIds, this.playerIdType);
    validateRequest$.pipe(takeUntil(this.onDestroy$)).subscribe(
      response => {
        this.isLoading = false;
        // Sort bad lookups to top of list
        this.playerIdentities = response
          .sort((a, b) => (a['error'] === b['error'] ? 0 : a['error'] ? -1 : 1))
          .map(data => {
            // If bad lookup, use query to populate the lookup string to show on ui
            if (!!data.error) {
              data[this.playerIdType] = data.query[this.playerIdType];
            }
            return data;
          });
        this.emitPlayerIdentities();
      },
      error => {
        this.isLoading = false;
        this.loadError = error;
      },
    );
  }

  /** Removes a given identity from the list. */
  public removeIdentityFromList(identity: IdentityResultsIntersection): void {
    this.playerIdentities = this.playerIdentities.filter(i => !isEqual(i, identity));
    this.emitPlayerIdentities();

    if (this.playerIdentities.length <= 0) {
      this.clearResults();
    }
  }

  /** Removed player at given index from the results list. */
  public removePlayerFromList(index: number): void {
    this.playerIdentities.splice(index, 1);
    this.emitPlayerIdentities();
    this.emitSelectedPlayerIdentity(null);

    if (this.playerIdentities.length <= 0) {
      this.clearResults();
    }
  }

  /** Sets and emits the selected player identity */
  public emitSelectedPlayerIdentity(identity: T): void {
    this.selectedPlayerIdentity = identity;
    this.playerIdentitySelectedEvent.emit(this.selectedPlayerIdentity);
  }

  /** Logic deciding if we should emit the player identities to its listeners. */
  public emitPlayerIdentities(): void {
    this.onChangeFunction(this.playerIdentities);
  }

  /** Called when the selected chips change. */
  public chipSelectionChange(event: MatChipListChange): void {
    const identity = event.value as T;
    this.selectedPlayerIdentity = identity;
    this.selectionChange.emit(event.value as T);
  }

  private onChangeFunction = (_value: T[]) => {
    /* empty */
  };
}
