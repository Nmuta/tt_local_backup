import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HiddenUgcTableComponent } from './hidden-ugc-table/hidden-ugc-table.component';
import { SunrisePlayerHiddenUgcComponent } from './sunrise-player-hidden-ugc/sunrise-player-hidden-ugc.component';
import { MatTableModule } from '@angular/material/table';
import { StandardDateModule } from '@components/standard-date/standard-date.module';
import { StandardCopyModule } from '@components/standard-copy/standard-copy.module';
import { MonitorActionModule } from '@shared/modules/monitor-action/monitor-action.module';

/**
 *  A feature module for retrieving and displaying a player's hidden UGC.
 */
@NgModule({
  declarations: [HiddenUgcTableComponent, SunrisePlayerHiddenUgcComponent],
  imports: [
    CommonModule,
    MatTableModule,
    StandardDateModule,
    StandardCopyModule,
    MonitorActionModule,
  ],
  exports: [HiddenUgcTableComponent, SunrisePlayerHiddenUgcComponent],
})
export class PlayerHiddenUgcModule {}
