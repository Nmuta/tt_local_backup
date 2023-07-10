import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SunrisePlayerAuctionActionLogComponent } from './sunrise/sunrise-player-auction-action-log.component';
import { AuctionActionLogTableComponent } from './log-table/log-table.component';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { LuxonModule } from 'luxon-angular';
import { MatIconModule } from '@angular/material/icon';
import { PipesModule } from '@shared/pipes/pipes.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { AuctionDataModule } from '@views/auction-data/auction-data.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MakeModelAutocompleteModule } from '@views/make-model-autocomplete/make-model-autocomplete.module';
import { StandardCopyModule } from '@shared/modules/standard-copy/standard-copy.module';
import { MatCardModule } from '@angular/material/card';
import { StandardDateModule } from '@components/standard-date/standard-date.module';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { MatButtonModule } from '@angular/material/button';
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
