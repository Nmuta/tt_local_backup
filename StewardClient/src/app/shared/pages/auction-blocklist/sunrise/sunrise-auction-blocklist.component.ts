import { Component } from '@angular/core';
import { AuctionBlocklistEntry } from '@models/auction-blocklist-entry';
import { Subject } from 'rxjs';
import { SunriseAuctionBlocklistService } from './sunrise-auction-blocklist.service';

/**
 *  Sunrise auction blocklist component.
 */
@Component({
  selector: 'sunrise-sevice-management',
  templateUrl: './sunrise-auction-blocklist.component.html',
  styleUrls: [],
  providers: [SunriseAuctionBlocklistService],
})
export class SunriseAuctionBlocklistComponent {
  public newEntries$ = new Subject<AuctionBlocklistEntry[]>();
  constructor(public service: SunriseAuctionBlocklistService) {}
}
