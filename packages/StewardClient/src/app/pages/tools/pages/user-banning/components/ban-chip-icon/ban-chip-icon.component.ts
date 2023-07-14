import BigNumber from 'bignumber.js';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { faGavel } from '@fortawesome/free-solid-svg-icons';
import { IdentityResultUnion } from '@models/identity-query.model';
import { SunriseBanSummary } from '@models/sunrise';
import { SteelheadBanSummary } from '@models/steelhead';
import { ApolloBanSummary } from '@models/apollo';
import { WoodstockBanSummary } from '@models/woodstock';
import { BetterSimpleChanges } from '@helpers/simple-changes';
import { ForumBanSummary } from '@models/forum-ban-summary.model';

export interface BanQuery {
  isLoading: boolean;
  loadError: boolean;
  banList: unknown[];
}

type AnyBanSummary =
  | SunriseBanSummary
  | SteelheadBanSummary
  | ApolloBanSummary
  | WoodstockBanSummary
  | ForumBanSummary;

/** Displays the ban chip icons for a given identity/query. */
@Component({
  selector: 'ban-chip-icon',
  templateUrl: './ban-chip-icon.component.html',
  styleUrls: ['./ban-chip-icon.component.scss'],
})
export class BanChipIconComponent extends BaseComponent implements OnChanges {
  /** REVIEW-COMMENT: Player identity. */
  @Input() public identity: IdentityResultUnion = null;
  /** REVIEW-COMMENT: Ban summary. */
  @Input() public banSummary: AnyBanSummary = null;
  /** REVIEW-COMMENT: Ban query. */
  @Input() public banQuery: BanQuery = null;
  /** REVIEW-COMMENT: Output for when gavel icon is clicked. */
  @Output() public gavelClick = new EventEmitter<BanChipIconComponent>();

  public bannedIcon = faGavel;

  public hasBans = false;
  public banCount: BigNumber = new BigNumber(0);

  constructor() {
    super();
  }

  /** Angular hook. */
  public ngOnChanges(_changes: BetterSimpleChanges<BanChipIconComponent>): void {
    if (this.banSummary) {
      this.banCount = this.banSummary.banCount;
      this.hasBans = this.banSummary.banCount > new BigNumber(0);
    } else {
      this.banCount = new BigNumber(0);
      this.hasBans = false;
    }
  }

  /** Fires when the gavel icon is clicked. */
  public onGavelClick(): void {
    this.gavelClick.emit(this);
  }
}
