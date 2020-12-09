import { Component, Input } from '@angular/core';


/** The shared top-level navbar. */
@Component({
  selector: 'player-selection',
  templateUrl: './player-selection.component.html',
  styleUrls: ['./player-selection.component.scss'],
})
export class PlayerSelectionComponent {
  @Input() allowT10Id: boolean = true;
  @Input() allowGroup: boolean = true;

  data: string = '';
  playerIds: string[] = [];
  playerIdType: string;

  showExpandedTextArea: boolean = false;
  disableValidateButton: boolean = true;
  showGroupDisabledError: boolean = false;

  constructor() { 
    // Empty 
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
      || this.playerIdType === '' || (!this.allowGroup && this.playerIds.length > 1);
  }

  /** Validates the provided player ids by getting each player id profile. */
  public validatePlayerIds(): void {
    console.log('Validate button was clicked');
  }
  
}