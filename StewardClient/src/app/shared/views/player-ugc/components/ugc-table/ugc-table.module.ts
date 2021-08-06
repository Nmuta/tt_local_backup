import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PipesModule } from '@shared/pipes/pipes.module';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { DirectivesModule } from '@shared/directives/directives.module';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { LuxonModule } from 'luxon-angular';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { ImageModalModule } from '@views/image-modal/image-modal.module';
import { SunriseUGCTableComponent } from './sunrise/sunrise-ugc-table.component';
import { WoodstockUGCTableComponent } from './woodstock/woodstock-ugc-table.component';

/** Module for a UGC table. */
@NgModule({
  declarations: [SunriseUGCTableComponent, WoodstockUGCTableComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatTooltipModule,
    FontAwesomeModule,
    PipesModule,
    ErrorSpinnerModule,
    JsonDumpModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    DirectivesModule,
    LuxonModule,
    ClipboardModule,
    ImageModalModule,
  ],
  exports: [SunriseUGCTableComponent, WoodstockUGCTableComponent],
})
export class UGCTableModule {}
