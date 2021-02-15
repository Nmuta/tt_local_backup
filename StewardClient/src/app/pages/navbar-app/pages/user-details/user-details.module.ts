import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PlayerSelectionSingleModule } from '@navbar-app/components/player-selection-single/player-selection-single.module';

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

/** The feature module for the User Details route. */
@NgModule({
  declarations: [
    UserDetailsComponent,
    SunriseUserDetailsComponent,
    OpusUserDetailsComponent,
    ApolloUserDetailsComponent,
    GravityUserDetailsComponent,
  ],
  imports: [
    CommonModule,
    ErrorSpinnerModule,
    UserDetailsRouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    FontAwesomeModule,
    FormsModule,
    PlayerSelectionSingleModule,
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
    PlayerSelectionSingleModule,
    MatTooltipModule,
  ],
})
export class UserDetailsModule {}
