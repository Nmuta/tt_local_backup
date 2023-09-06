import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { BaseComponent } from '@components/base-component/base.component';
import { AuctionBlocklistEntry } from '@models/auction-blocklist-entry';
import { GameTitle } from '@models/enums';
import { takeUntil } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { orderBy } from 'lodash';
import { WoodstockAuctionsService } from '@services/api-v2/woodstock/auctions/woodstock-auctions.service';

/**
 *  Woodstock Auction blocklist component.
 */
@Component({
  selector: 'woodstock-auction-blocklist',
  templateUrl: './woodstock-auction-blocklist.component.html',
  styleUrls: ['./woodstock-auction-blocklist.component.scss'],
})
export class WoodstockAuctionBlocklistBaseComponent extends BaseComponent implements OnInit {
  public gameTitle = GameTitle.FH5;

  public blocklist = new MatTableDataSource<AuctionBlocklistEntry>();
  public columnsToDisplay = ['carId', 'description', 'expireDate', 'series'];
  public getMonitor: ActionMonitor = new ActionMonitor('GET');

  public formControls = {
    keyword: new UntypedFormControl(''),
    currentSeries: new UntypedFormControl(24, Validators.required),
  };

  public formGroup: UntypedFormGroup = new UntypedFormGroup(this.formControls);

  constructor(private readonly woodstockAuctionsService: WoodstockAuctionsService) {
    super();
  }

  /** Lifecycle hook. */
  public ngOnInit(): void {
    this.updateBlocklist();
  }

  /** Sets keyword entered as the data table filter */
  public search(): void {
    this.blocklist.filter = this.formControls.keyword.value;
  }

  /** Update the displayed blocklist. */
  public updateBlocklist(): void {
    this.getMonitor = this.getMonitor.repeat();
    this.woodstockAuctionsService
      .getAuctionBlocklist$(this.formControls.currentSeries.value)
      .pipe(this.getMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(auctionBlocklist => {
        this.blocklist.data = orderBy(auctionBlocklist, content => content.series, 'desc');
      });
  }
}
