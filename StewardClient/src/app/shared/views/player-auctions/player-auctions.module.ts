import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { MatTableModule } from '@angular/material/table';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PipesModule } from '@shared/pipes/pipes.module';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { MatIconModule } from '@angular/material/icon';
import { SunrisePlayerAuctionsComponent } from './sunrise/sunrise-player-auctions.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { DirectivesModule } from '@shared/directives/directives.module';
import { AuctionFiltersModule } from '../auction-filters/auction-filters.module';
import { LuxonModule } from 'luxon-angular';
import { ImageModalModule } from '@views/image-modal/image-modal.module';
import { WoodstockPlayerAuctionsComponent } from './woodstock/woodstock-player-auctions.component';

/** Display for player auctions. */
@NgModule({
  declarations: [SunrisePlayerAuctionsComponent, WoodstockPlayerAuctionsComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatTooltipModule,
    FontAwesomeModule,
    PipesModule,
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
  exports: [SunrisePlayerAuctionsComponent, WoodstockPlayerAuctionsComponent],
})
export class PlayerAuctionsModule {}
