import { Component, EventEmitter, Output } from '@angular/core';
import { AuctionBlocklistEntry } from '@models/auction-blocklist-entry';
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
  @Output() newEntries = new EventEmitter<AuctionBlocklistEntry[]>();
  constructor(public service: WoodstockAuctionBlocklistNewEntryService) {}
}
