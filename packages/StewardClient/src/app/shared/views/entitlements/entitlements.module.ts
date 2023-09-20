import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { PipesModule } from '@shared/pipes/pipes.module';
import { LuxonModule } from 'luxon-angular';
import { DirectivesModule } from '@shared/directives/directives.module';
import { EntitlementsComponent } from './entitlements.component';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';

/** Module for player entitlements data. */
@NgModule({
  declarations: [EntitlementsComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatTooltipModule,
    ErrorSpinnerModule,
    JsonDumpModule,
    MatIconModule,
    PipesModule,
    JsonDumpModule,
    LuxonModule,
    DirectivesModule,
    MatCardModule,
    MatTableModule,
    ErrorSpinnerModule,
  ],
  exports: [EntitlementsComponent],
})
export class EntitlementsModule {}
