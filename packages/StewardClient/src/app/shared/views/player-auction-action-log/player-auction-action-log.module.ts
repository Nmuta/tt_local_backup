import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SunrisePlayerAuctionActionLogComponent } from './sunrise/sunrise-player-auction-action-log.component';
import { AuctionActionLogTableComponent } from './log-table/log-table.component';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatSortModule } from '@angular/material/sort';
import { LuxonModule } from 'luxon-angular';
import { MatIconModule } from '@angular/material/icon';
import { PipesModule } from '@shared/pipes/pipes.module';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { AuctionDataModule } from '@views/auction-data/auction-data.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MakeModelAutocompleteModule } from '@views/make-model-autocomplete/make-model-autocomplete.module';
import { StandardCopyModule } from '@shared/modules/standard-copy/standard-copy.module';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { StandardDateModule } from '@components/standard-date/standard-date.module';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { DirectivesModule } from '@shared/directives/directives.module';
import { WoodstockPlayerAuctionActionLogComponent } from './woodstock/woodstock-player-auction-action-log.component';
import { LogTableLoaderComponent } from './log-table-loader/log-table-loader.component';
import { RouterModule } from '@angular/router';

/** Components for rendering a player's auction actions. */
@NgModule({
  declarations: [
    SunrisePlayerAuctionActionLogComponent,
    AuctionActionLogTableComponent,
    WoodstockPlayerAuctionActionLogComponent,
    LogTableLoaderComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    StandardCopyModule,
    ReactiveFormsModule,
    MatSortModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatPaginatorModule,
    LuxonModule,
    MatIconModule,
    PipesModule,
    MatTooltipModule,
    MatExpansionModule,
    AuctionDataModule,
    MatDatepickerModule,
    MatCardModule,
    MakeModelAutocompleteModule,
    StandardDateModule,
    ErrorSpinnerModule,
    MatButtonModule,
    DirectivesModule,
    RouterModule,
  ],
  exports: [SunrisePlayerAuctionActionLogComponent, WoodstockPlayerAuctionActionLogComponent],
})
export class PlayerAuctionActionLogModule {}
