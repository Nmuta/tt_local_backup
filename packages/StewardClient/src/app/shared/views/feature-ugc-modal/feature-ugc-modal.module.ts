import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { PipesModule } from '@shared/pipes/pipes.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SunriseFeatureUgcModalComponent } from './sunrise/sunrise-feature-ugc-modal.component';
import { WoodstockFeatureUgcModalComponent } from './woodstock/woodstock-feature-ugc-modal.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DirectivesModule } from '@shared/directives/directives.module';
import { StateManagersModule } from '@shared/modules/state-managers/state-managers.module';
import { MonitorActionModule } from '@shared/modules/monitor-action/monitor-action.module';
import { StandardDateModule } from '@components/standard-date/standard-date.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { VerifyButtonModule } from '@shared/modules/verify/verify-button.module';
import { PermissionsModule } from '@shared/modules/permissions/permissions.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HelpModule } from '../../modules/help/help.module';

/** Module for setting UGC item's featured status with a modal. */
@NgModule({
    declarations: [SunriseFeatureUgcModalComponent, WoodstockFeatureUgcModalComponent],
    exports: [SunriseFeatureUgcModalComponent, WoodstockFeatureUgcModalComponent],
    imports: [
        CommonModule,
        MatDialogModule,
        MatTooltipModule,
        ErrorSpinnerModule,
        JsonDumpModule,
        MatIconModule,
        MatButtonModule,
        PipesModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
        DirectivesModule,
        StateManagersModule,
        MonitorActionModule,
        MatDatepickerModule,
        StandardDateModule,
        VerifyButtonModule,
        PermissionsModule,
        FontAwesomeModule,
        HelpModule
    ]
})
export class FeatureUgcModalModule {}
