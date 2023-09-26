import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PipesModule } from '@shared/pipes/pipes.module';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { MatIconModule } from '@angular/material/icon';
import { SunrisePlayerAuctionsComponent } from './sunrise/sunrise-player-auctions.component';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { DirectivesModule } from '@shared/directives/directives.module';
import { AuctionFiltersModule } from '../auction-filters/auction-filters.module';
import { LuxonModule } from 'luxon-angular';
import { ImageModalModule } from '@views/image-modal/image-modal.module';
import { WoodstockPlayerAuctionsComponent } from './woodstock/woodstock-player-auctions.component';
import { SteelheadPlayerAuctionsComponent } from './steelhead/steelhead-player-auctions.component';

/** Display for player auctions. */
@NgModule({
  declarations: [
    SunrisePlayerAuctionsComponent,
    WoodstockPlayerAuctionsComponent,
    SteelheadPlayerAuctionsComponent,
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatTooltipModule,
    MatExpansionModule,
    FontAwesomeModule,
    ErrorSpinnerModule,
    JsonDumpModule,
    MatIconModule,
    MatPaginatorModule,
    MatButtonModule,
    DirectivesModule,
    AuctionFiltersModule,
    PipesModule,
    LuxonModule,
    ImageModalModule,
  ],
  exports: [
    SunrisePlayerAuctionsComponent,
    WoodstockPlayerAuctionsComponent,
    SteelheadPlayerAuctionsComponent,
  ],
})
export class PlayerAuctionsModule {}
