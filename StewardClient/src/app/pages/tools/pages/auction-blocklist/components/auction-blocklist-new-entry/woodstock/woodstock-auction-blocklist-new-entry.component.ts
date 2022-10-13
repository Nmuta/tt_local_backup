import { Component, EventEmitter, Output } from '@angular/core';
import { AuctionBlocklistEntry } from '@models/auction-blocklist-entry';
import { PegasusProjectionSlot } from '@models/enums';
import { WoodstockAuctionBlocklistNewEntryService } from './woodstock-auction-blocklist-new-entry.service';

/**
 *  Woodstock auction blocklist new entry component.
 */
@Component({
  selector: 'woodstock-auction-blocklist-new-entry',
  templateUrl: './woodstock-auction-blocklist-new-entry.component.html',
  styleUrls: [],
  providers: [WoodstockAuctionBlocklistNewEntryService],
})
export class WoodstockAuctionBlocklistNewEntryComponent {
  /** REVIEW-COMMENT: Output when a new list of auction blocklist entry is created. */
  @Output() newEntries = new EventEmitter<AuctionBlocklistEntry[]>();
  public readonly pegasusSlotId: PegasusProjectionSlot = PegasusProjectionSlot.LiveSteward;
  constructor(public service: WoodstockAuctionBlocklistNewEntryService) {}
}
