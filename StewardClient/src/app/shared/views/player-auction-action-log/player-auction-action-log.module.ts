import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SunrisePlayerAuctionActionLogComponent } from './sunrise/sunrise.component';
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
import { AuctionDataModule } from '@views/auction-data/auction-data.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MakeModelAutocompleteModule } from '@views/make-model-autocomplete/make-model-autocomplete.module';
import { StandardCopyModule } from '@components/standard-copy/standard-copy.module';
import { MatCardModule } from '@angular/material/card';
import { StandardDateModule } from '@components/standard-date/standard-date.module';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';

/** Components for rendering a player's auction actions. */
@NgModule({
  declarations: [SunrisePlayerAuctionActionLogComponent, AuctionActionLogTableComponent],
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
    AuctionDataModule,
    MatDatepickerModule,
    MatCardModule,
    MakeModelAutocompleteModule,
    StandardDateModule,
    ErrorSpinnerModule,
  ],
  exports: [SunrisePlayerAuctionActionLogComponent],
})
export class PlayerAuctionActionLogModule {}
