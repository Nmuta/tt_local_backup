import { Component } from '@angular/core';
import { AuctionBlocklistEntry } from '@models/auction-blocklist-entry';
import { Subject } from 'rxjs';
import { WoodstockAuctionBlocklistService } from './woodstock-auction-blocklist.service';

/**
 *  Woodstock auction blocklist component.
 */
@Component({
  selector: 'woodstock-sevice-management',
  templateUrl: './woodstock-auction-blocklist.component.html',
  styleUrls: [],
  providers: [WoodstockAuctionBlocklistService],
})
export class WoodstockAuctionBlocklistComponent {
  public newEntries$ = new Subject<AuctionBlocklistEntry[]>();
  constructor(public service: WoodstockAuctionBlocklistService) {}
}
