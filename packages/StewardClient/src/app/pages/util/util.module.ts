import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilComponent } from './util.component';
import { DemoRouterModule } from './util.routing';
import { MatCardModule } from '@angular/material/card';
import { CenterContentsModule } from '@components/center-contents/center-contents.module';
import { ColorsComponent } from './colors/colors.component';
import { IconsComponent } from './icons/icons.component';
import { SelectorHelperComponent } from './selector-helper/selector-helper.component';
import { PipesModule } from '@shared/pipes/pipes.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { NgPipesModule } from 'ngx-pipes';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DirectivesModule } from '@shared/directives/directives.module';
import { SetFakeApiComponent } from './set-fake-api/set-fake-api.component';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { TypographyComponent } from './typography/typography.component';
import { ActionMonitorSinglefireComponent } from './action-monitor-singlefire/action-monitor-singlefire.component';
import { MonitorActionModule } from '@shared/modules/monitor-action/monitor-action.module';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { StateManagersModule } from '@shared/modules/state-managers/state-managers.module';
import { ActionMonitorMultifireComponent } from './action-monitor-multifire/action-monitor-multifire.component';
import { LoggingComponent } from './logging/logging.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DateTimePickerDemoComponent } from './datetime-picker-demo/datetime-picker-demo.component';
import { DateTimePickersModule } from '@components/date-time-pickers/date-time-pickers.module';
import { StandardFormsComponent } from './standard-forms/standard-forms.component';
import { HelpModule } from '@shared/modules/help/help.module';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { ChipsComponent } from './chips/chips.component';
import { MatChipsModule } from '@angular/material/chips';
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