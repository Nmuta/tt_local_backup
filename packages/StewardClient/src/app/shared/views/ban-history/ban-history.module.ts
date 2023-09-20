import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SunriseBanHistoryComponent } from './sunrise/sunrise-ban-history.component';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PipesModule } from '@shared/pipes/pipes.module';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { ApolloBanHistoryComponent } from './apollo/apollo-ban-history.component';
import { MatDividerModule } from '@angular/material/divider';
import { ApolloBanHistoryCompactComponent } from './apollo/compact/apollo-ban-history-compact.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { SunriseBanHistoryCompactComponent } from './sunrise/compact/sunrise-ban-history-compact.component';
import { StewardUserModule } from '@views/steward-user/steward-user.module';
import { SteelheadBanHistoryComponent } from './steelhead/steelhead-ban-history.component';
import { SteelheadBanHistoryCompactComponent } from './steelhead/compact/steelhead-ban-history-compact.component';
import { WoodstockBanHistoryComponent } from './woodstock/woodstock-ban-history.component';
import { WoodstockBanHistoryCompactComponent } from './woodstock/compact/woodstock-ban-history-compact.component';
import { MatIconModule } from '@angular/material/icon';
import { STANDARD_DATE_IMPORTS } from '@helpers/standard-imports';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { VerifyButtonModule } from '@shared/modules/verify/verify-button.module';
import { StateManagersModule } from '@shared/modules/state-managers/state-managers.module';
import { MonitorActionModule } from '@shared/modules/monitor-action/monitor-action.module';
import { PermissionsModule } from '@shared/modules/permissions/permissions.module';
import { HelpModule } from '@shared/modules/help/help.module';
import { RouterModule } from '@angular/router';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';

/** A domain module for displaying player ban histories. */
@NgModule({
  declarations: [
    WoodstockBanHistoryComponent,
    WoodstockBanHistoryCompactComponent,
    SteelheadBanHistoryComponent,
    SteelheadBanHistoryCompactComponent,
    SunriseBanHistoryComponent,
    SunriseBanHistoryCompactComponent,
    ApolloBanHistoryComponent,
    ApolloBanHistoryCompactComponent,
  ],
  imports: [
    CommonModule,
    ...STANDARD_DATE_IMPORTS,
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
    MatButtonModule,
    MatCheckboxModule,
    VerifyButtonModule,
    StateManagersModule,
    MonitorActionModule,
    PermissionsModule,
    HelpModule,
    RouterModule,
    MatChipsModule,
  ],
  exports: [
    WoodstockBanHistoryComponent,
    WoodstockBanHistoryCompactComponent,
    SteelheadBanHistoryComponent,
    SteelheadBanHistoryCompactComponent,
    SunriseBanHistoryComponent,
    SunriseBanHistoryCompactComponent,
    ApolloBanHistoryComponent,
    ApolloBanHistoryCompactComponent,
  ],
})
export class BanHistoryModule {}
