import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PlayerSelectionModule } from '@shared/views/player-selection/player-selection.module';

import { UserDetailsComponent } from './user-details.component';
import { UserDetailsRouterModule } from './user-details.routing';
import { OpusUserDetailsComponent } from './opus/opus-user-details.component';
import { ApolloUserDetailsComponent } from './apollo/apollo-user-details.component';
import { GravityUserDetailsComponent } from './gravity/gravity-user-details.component';
import { SunriseUserDetailsComponent } from './sunrise/sunrise-user-details.component';
import { MatTabsModule } from '@angular/material/tabs';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { PipesModule } from '@shared/pipes/pipes.module';
import { BanHistoryModule } from '@shared/views/ban-history/ban-history.module';
import { ConsolesModule } from '@shared/views/consoles/consoles.module';
import { CreditHistoryModule } from '@shared/views/credit-history/credit-history.module';
import { GamertagsModule } from '@shared/views/gamertags/gamertags.module';
import { OverviewModule } from '@shared/views/overview/overview.module';
import { PlayerInventoryModule } from '@shared/views/player-inventory/player-inventory.module';
import { PlayerNotificationsModule } from '@shared/views/player-notifications/player-notifications.module';
import { UserFlagsModule } from '@shared/views/user-flags/user-flags.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PlayerInventoryProfilesModule } from '@shared/views/player-inventory-profiles/player-inventory-profiles.module';
import { PlayerIdentityResultsModule } from '@shared/views/player-identity-results/player-identity-results.module';
import { ProfileNotesModule } from '@views/profile-notes/profile-notes.module';
import { SteelheadUserDetailsComponent } from './steelhead/steelhead-user-details.component';
import { PlayerAuctionsModule } from '@views/player-auctions/player-auctions.module';
import { WoodstockUserDetailsComponent } from './woodstock/woodstock-user-details.component';
import { MatCardModule } from '@angular/material/card';
import { BackstagePassHistoryModule } from '@views/backstage-pass-history/backstage-pass-history.module';
import { PlayerAccountInventoryModule } from '@views/player-account-inventory/player-account-inventory.module';
import { EndpointSelectionModule } from '@views/endpoint-selection/endpoint-selection.module';
import { EntitlementsModule } from '@views/entitlements/entitlements.module';
import { PlayerAuctionActionLogModule } from '@views/player-auction-action-log/player-auction-action-log.module';
import { GeneralUserDetailsComponent } from './general/general-user-details.component';
import { PlayerHiddenUgcModule } from '@views/player-hidden-ugc/player-hidden-ugc.module';
import { MonitorActionModule } from '@shared/modules/monitor-action/monitor-action.module';
import { PlayerUgcModule } from '@views/player-ugc/player-ugc.module';
import { ReportWeightModule } from '@views/report-weight/report-weight.module';
import { LoyaltyRewardsModule } from '@views/loyalty-rewards/loyalty-rewards.module';
import { PlayerProfileManagementModule } from '@views/player-profile-management/player-profile-management.module';

/** The feature module for the User Details route. */
@NgModule({
  declarations: [
    UserDetailsComponent,
    SunriseUserDetailsComponent,
    OpusUserDetailsComponent,
    ApolloUserDetailsComponent,
    GravityUserDetailsComponent,
    SteelheadUserDetailsComponent,
    WoodstockUserDetailsComponent,
    GeneralUserDetailsComponent,
  ],
  imports: [
    CommonModule,
    ErrorSpinnerModule,
    UserDetailsRouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatCardModule,
    FontAwesomeModule,
    FormsModule,
    PlayerSelectionModule,
    CommonModule,
    MatTabsModule,
    PipesModule,
    UserFlagsModule,
    BanHistoryModule,
    GamertagsModule,
    ConsolesModule,
    OverviewModule,
    CreditHistoryModule,
    JsonDumpModule,
    PlayerNotificationsModule,
    PlayerInventoryModule,
    PlayerInventoryProfilesModule,
    PlayerSelectionModule,
    MatTooltipModule,
    PlayerIdentityResultsModule,
    PlayerAuctionsModule,
    ProfileNotesModule,
    BackstagePassHistoryModule,
    PlayerAccountInventoryModule,
    EndpointSelectionModule,
    EntitlementsModule,
    PlayerAuctionActionLogModule,
    PlayerHiddenUgcModule,
    MonitorActionModule,
    PlayerUgcModule,
    ReportWeightModule,
    LoyaltyRewardsModule,
    PlayerProfileManagementModule,
  ],
})
export class UserDetailsModule {}
