import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PipesModule } from '@shared/pipes/pipes.module';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { StewardUserModule } from '@views/steward-user/steward-user.module';
import { MatIconModule } from '@angular/material/icon';
import { STANDARD_DATE_IMPORTS } from '@helpers/standard-imports';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { VerifyButtonModule } from '@shared/modules/verify/verify-button.module';
import { StateManagersModule } from '@shared/modules/state-managers/state-managers.module';
import { MonitorActionModule } from '@shared/modules/monitor-action/monitor-action.module';
import { PermissionsModule } from '@shared/modules/permissions/permissions.module';
import { ForumBanHistoryCompactComponent } from './forum-ban-history-compact.component';
import { ForumBanHistoryComponent } from './forum-ban-history.component';

/** A domain module for displaying forum ban histories. */
@NgModule({
  declarations: [ForumBanHistoryComponent, ForumBanHistoryCompactComponent],
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
  ],
  exports: [ForumBanHistoryComponent, ForumBanHistoryCompactComponent],
})
export class ForumBanHistoryModule {}
