import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatChipsModule } from '@angular/material/chips';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PipesModule } from '@shared/pipes/pipes.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { DirectivesModule } from '@shared/directives/directives.module';
import { MatTabsModule } from '@angular/material/tabs';
import { SunriseCommunityMessagingComponent } from './sunrise/sunrise-community-messaging.component';
import { NewCommunityMessageComponent } from './components/new-community-message/new-community-message.component';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { JsonTableResultsModule } from '@components/json-table-results/json-table-results.module';
import { MatIconModule } from '@angular/material/icon';
import { MatLuxonDateModule } from 'ngx-material-luxon';
import { WoodstockCommunityMessagingComponent } from './woodstock/woodstock-community-messaging.component';
import { STANDARD_DATE_IMPORTS } from '@helpers/standard-imports';
import { DateTimePickersModule } from '@components/date-time-pickers/date-time-pickers.module';
import { StandardDateModule } from '@components/standard-date/standard-date.module';
import { StateManagersModule } from '@shared/modules/state-managers/state-managers.module';
import { PermissionsModule } from '@shared/modules/permissions/permissions.module';

/** Routed module for banning users. */
@NgModule({
  declarations: [
    SunriseCommunityMessagingComponent,
    WoodstockCommunityMessagingComponent,
    NewCommunityMessageComponent,
  ],
  imports: [
    ...STANDARD_DATE_IMPORTS,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatLuxonDateModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    FontAwesomeModule,
    MatChipsModule,
    PipesModule,
    JsonDumpModule,
    DirectivesModule,
    MatTabsModule,
    MatIconModule,
    TextFieldModule,
    JsonTableResultsModule,
    DateTimePickersModule,
    StandardDateModule,
    StateManagersModule,
    PermissionsModule,
  ],
  exports: [
    SunriseCommunityMessagingComponent,
    WoodstockCommunityMessagingComponent,
    NewCommunityMessageComponent,
  ],
})
export class CommunityMessagingModule {}
