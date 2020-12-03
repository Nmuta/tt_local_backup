import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { PipesModule } from '@shared/pipes/pipes.module';
import { BanHistoryModule } from '@shared/views/ban-history/ban-history.module';
import { ConsolesModule } from '@shared/views/consoles/consoles.module';
import { GamertagsModule } from '@shared/views/gamertags/gamertags.module';
import { OverviewModule } from '@shared/views/overview/overview.module';
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
  ],
})
export class SunriseModule {}
