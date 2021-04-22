import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SunriseBanHistoryComponent } from './sunrise/sunrise-ban-history.component';
import { MatCardModule } from '@angular/material/card';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { MatTableModule } from '@angular/material/table';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PipesModule } from '@shared/pipes/pipes.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { ApolloBanHistoryComponent } from './apollo/apollo-ban-history.component';
import { MatDividerModule } from '@angular/material/divider';
import { ApolloBanHistoryCompactComponent } from './apollo/compact/apollo-ban-history-compact.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SunriseBanHistoryCompactComponent } from './sunrise/compact/sunrise-ban-history-compact.component';
import { StewardUserModule } from '@views/steward-user/steward-user.module';
import { SteelheadBanHistoryComponent } from './steelhead/steelhead-ban-history.component';
import { SteelheadBanHistoryCompactComponent } from './steelhead/compact/steelhead-ban-history-compact.component';
import { MatIconModule } from '@angular/material/icon';

/** A domain module for displaying player ban histories. */
@NgModule({
  declarations: [
    SteelheadBanHistoryComponent,
    SteelheadBanHistoryCompactComponent,
    SunriseBanHistoryComponent,
    SunriseBanHistoryCompactComponent,
    ApolloBanHistoryComponent,
    ApolloBanHistoryCompactComponent,
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    ErrorSpinnerModule,
    MatTableModule,
    FontAwesomeModule,
    PipesModule,
    JsonDumpModule,
    MatDividerModule,
    MatExpansionModule,
    MatTooltipModule,
    StewardUserModule,
    MatIconModule,
  ],
  exports: [
    SteelheadBanHistoryComponent,
    SteelheadBanHistoryCompactComponent,
    SunriseBanHistoryComponent,
    SunriseBanHistoryCompactComponent,
    ApolloBanHistoryComponent,
    ApolloBanHistoryCompactComponent,
  ],
})
export class BanHistoryModule {}
