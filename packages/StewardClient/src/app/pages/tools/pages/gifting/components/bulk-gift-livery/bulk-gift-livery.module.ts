import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PipesModule } from '@shared/pipes/pipes.module';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { DirectivesModule } from '@shared/directives/directives.module';
import { MatDialogModule } from '@angular/material/dialog';
import { LuxonModule } from 'luxon-angular';
import { GiftingResultModule } from '../gifting-result/gifting-result.module';
import { PastableSingleInputModule } from '@views/pastable-single-input/pastable-single-input.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { WoodstockBulkGiftLiveryComponent } from './woodstock/woodstock-bulk-gift-livery.component';
import { MonitorActionModule } from '@shared/modules/monitor-action/monitor-action.module';
import { BulkGiftLiveryComponent } from './bulk-gift-livery.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { StateManagersModule } from '@shared/modules/state-managers/state-managers.module';
import { PermissionsModule } from '@shared/modules/permissions/permissions.module';
import { SteelheadBulkGiftLiveryComponent } from './steelhead/steelhead-bulk-gift-livery.component';
import { LocalizationModule } from '@components/localization/localization.module';

/** The gift livery module. */
@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    SteelheadBulkGiftLiveryComponent,
    WoodstockBulkGiftLiveryComponent,
    BulkGiftLiveryComponent,
  ],
  imports: [
    CommonModule,
    ErrorSpinnerModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    PipesModule,
    JsonDumpModule,
    MatIconModule,
    PastableSingleInputModule,
    MatSelectModule,
    MatOptionModule,
    DirectivesModule,
    MatDialogModule,
    LuxonModule,
    MatIconModule,
    GiftingResultModule,
    MatExpansionModule,
    MonitorActionModule,
    MatDatepickerModule,
    MatCheckboxModule,
    StateManagersModule,
    PermissionsModule,
    LocalizationModule,
  ],
  exports: [SteelheadBulkGiftLiveryComponent, WoodstockBulkGiftLiveryComponent],
})
export class BulkGiftLiveryModule {}
