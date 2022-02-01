import { Component, EventEmitter, Output } from '@angular/core';
import { AuctionBlocklistEntry } from '@models/auction-blocklist-entry';
import { SunriseAuctionBlocklistNewEntryService } from './sunrise-auction-blocklist-new-entry.service';

/**
 *  Sunrise auction blocklist new entry component.
 */
@Component({
  selector: 'sunrise-auction-blocklist-new-entry',
  templateUrl: './sunrise-auction-blocklist-new-entry.component.html',
  styleUrls: [],
  providers: [SunriseAuctionBlocklistNewEntryService],
})
export class SunriseAuctionBlocklistNewEntryComponent {
  @Output() newEntries = new EventEmitter<AuctionBlocklistEntry[]>();
  constructor(public service: SunriseAuctionBlocklistNewEntryService) {}
}
