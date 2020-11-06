import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Clipboard } from '@shared/helpers/clipboard';

/** Defines a player details information item. */
@Component({
  selector: 'player-details-item',
  templateUrl: './player-details-item.html',
  styleUrls: ['./player-details-item.scss'],
})
export class PlayerDetailsItemComponent implements OnInit {
  @Input() public name: string;
  @Input() public value: string;
  public copied;
  public showItem;

  constructor(private clipboard: Clipboard) {}

  /** Logic for the OnInit component lifecycle. */
  public ngOnInit() {
    this.showItem = this.value !== undefined;
  }

  /** Copies the value to client clipboard. */
  public copyToClipboard() {
    this.copied = true;
    this.clipboard.copyMessage(this.value);

    setTimeout(() => {
      this.copied = false;
    }, 1500);
  }
}
