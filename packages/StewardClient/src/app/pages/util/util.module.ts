import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilComponent } from './util.component';
import { DemoRouterModule } from './util.routing';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { CenterContentsModule } from '@components/center-contents/center-contents.module';
import { ColorsComponent } from './colors/colors.component';
import { IconsComponent } from './icons/icons.component';
import { SelectorHelperComponent } from './selector-helper/selector-helper.component';
import { PipesModule } from '@shared/pipes/pipes.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { NgPipesModule } from 'ngx-pipes';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { DirectivesModule } from '@shared/directives/directives.module';
import { SetFakeApiComponent } from './set-fake-api/set-fake-api.component';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { TypographyComponent } from './typography/typography.component';
import { ActionMonitorSinglefireComponent } from './action-monitor-singlefire/action-monitor-singlefire.component';
import { MonitorActionModule } from '@shared/modules/monitor-action/monitor-action.module';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { StateManagersModule } from '@shared/modules/state-managers/state-managers.module';
import { ActionMonitorMultifireComponent } from './action-monitor-multifire/action-monitor-multifire.component';
import { LoggingComponent } from './logging/logging.component';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { DateTimePickerDemoComponent } from './datetime-picker-demo/datetime-picker-demo.component';
import { DateTimePickersModule } from '@components/date-time-pickers/date-time-pickers.module';
import { StandardFormsComponent } from './standard-forms/standard-forms.component';
import { HelpModule } from '@shared/modules/help/help.module';
import { MatLegacyOptionModule as MatOptionModule } from '@angular/material/legacy-core';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { ChipsComponent } from './chips/chips.component';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { StandardCopyModule } from '@shared/modules/standard-copy/standard-copy.module';

/** Demonstration and style testing pages. */
@NgModule({
  declarations: [
    UtilComponent,
    ColorsComponent,
    IconsComponent,
    SelectorHelperComponent,
    SetFakeApiComponent,
    TypographyComponent,
    ActionMonitorSinglefireComponent,
    ActionMonitorMultifireComponent,
    LoggingComponent,
    DateTimePickerDemoComponent,
    StandardFormsComponent,
    ChipsComponent,
  ],
  imports: [
    DemoRouterModule,
    CommonModule,
    MatCardModule,
    CenterContentsModule,
    PipesModule,
    MatExpansionModule,
    NgPipesModule,
    ClipboardModule,
    MatIconModule,
    MatTooltipModule,
    DirectivesModule,
    ErrorSpinnerModule,
    MatButtonModule,
    MatInputModule,
    FormsModule,
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MonitorActionModule,
    StateManagersModule,
    DateTimePickersModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    HelpModule,
    MatChipsModule,
    StandardCopyModule,
  ],
})
export class UtilModule {}
