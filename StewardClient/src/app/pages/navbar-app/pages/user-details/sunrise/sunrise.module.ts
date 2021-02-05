import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { PlayerSelectionSingleModule } from '@navbar-app/components/player-selection-single/player-selection-single.module';
import { PipesModule } from '@shared/pipes/pipes.module';
import { BanHistoryModule } from '@shared/views/ban-history/ban-history.module';
import { ConsolesModule } from '@shared/views/consoles/consoles.module';
import { CreditHistoryModule } from '@shared/views/credit-history/credit-history.module';
import { GamertagsModule } from '@shared/views/gamertags/gamertags.module';
import { OverviewModule } from '@shared/views/overview/overview.module';
import { PlayerInventoryModule } from '@shared/views/player-inventory/player-inventory.module';
import { PlayerNotificationsModule } from '@shared/views/player-notifications/player-notifications.module';
import { UserFlagsModule } from '@shared/views/user-flags/user-flags.module';

import { SunriseComponent } from './sunrise.component';

/** Routed module for Sunrise User Details */
@NgModule({
  declarations: [SunriseComponent],
  imports: [
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
    PlayerSelectionSingleModule,
  ],
})
export class SunriseModule {}
