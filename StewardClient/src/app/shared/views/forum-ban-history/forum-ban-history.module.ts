import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { MatTableModule } from '@angular/material/table';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PipesModule } from '@shared/pipes/pipes.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { StewardUserModule } from '@views/steward-user/steward-user.module';
import { MatIconModule } from '@angular/material/icon';
import { STANDARD_DATE_IMPORTS } from '@helpers/standard-imports';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { VerifyCheckboxModule } from '@shared/modules/verify/verify-checkbox.module';
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
    VerifyCheckboxModule,
    StateManagersModule,
    MonitorActionModule,
    PermissionsModule,
  ],
  exports: [ForumBanHistoryComponent, ForumBanHistoryCompactComponent],
})
export class ForumBanHistoryModule {}
