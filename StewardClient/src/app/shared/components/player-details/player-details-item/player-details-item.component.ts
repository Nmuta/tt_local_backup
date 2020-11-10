import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Clipboard } from '@shared/helpers/clipboard';

/** Defines a player details information item. */
@Component({
  selector: 'player-details-item',
  templateUrl: './player-details-item.html',
  styleUrls: ['./player-details-item.scss'],
})
export class PlayerDetailsItemComponent implements OnInit {
  /** Name of the player detail item. */
  @Input() public name: string;
  /** Value of the player details item */
  @Input() public value: string;

  /** Determines when to show the 'Copied!' UI notification.  */
  public copied: boolean;
  /** Determines if the item should be displayed on the UI */
  public showItem: boolean;
  /** The existing timeout object */
  public timeoutObj: any;

  constructor(private clipboard: Clipboard) {}

  /** Logic for the OnInit component lifecycle. */
  public ngOnInit() {
    this.showItem = this.value !== undefined;
  }

  /** Copies the value to client clipboard. */
  public copyToClipboard() {
    this.copied = true;
    this.clipboard.copyMessage(this.value);

    if (!!this.timeoutObj) clearTimeout(this.timeoutObj);

    this.timeoutObj = setTimeout(() => {
      this.copied = false;
    }, 1500);
  }
}
