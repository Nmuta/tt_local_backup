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
import { WoodstockBanHistoryComponent } from './woodstock/woodstock-ban-history.component';
import { WoodstockBanHistoryCompactComponent } from './woodstock/compact/woodstock-ban-history-compact.component';
import { MatIconModule } from '@angular/material/icon';
import { STANDARD_DATE_IMPORTS } from '@helpers/standard-imports';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { VerifyCheckboxModule } from '@shared/modules/verify/verify-checkbox.module';
import { StateManagersModule } from '@shared/modules/state-managers/state-managers.module';
import { MonitorActionModule } from '@shared/modules/monitor-action/monitor-action.module';
import { PermissionsModule } from '@shared/modules/permissions/permissions.module';

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
    VerifyCheckboxModule,
    StateManagersModule,
    MonitorActionModule,
    PermissionsModule,
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
