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
import { VerifyActionButtonModule } from '@components/verify-action-button/verify-action-button.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatChipsModule } from '@angular/material/chips';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PlayerSelectionModule } from '@navbar-app/components/player-selection/player-selection.module';
import { PipesModule } from '@shared/pipes/pipes.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { DirectivesModule } from '@shared/directives/directives.module';
import { MatTabsModule } from '@angular/material/tabs';
import { SunriseCommunityMessagingComponent } from './sunrise/sunrise-community-messaging.component';
import { CommunityMessagingRoutingModule } from './community-messaging.routing';
import { CommunityMessagingComponent } from './community-messaging.component';
import { LspGroupSelectionModule } from '@navbar-app/components/lsp-group-selection/lsp-group-selection.module';
import { NewCommunityMessageComponent } from '@shared/pages/community-messaging/components/new-community-message/new-community-message.component';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { JsonTableResultsModule } from '@components/json-table-results/json-table-results.module';
import { MatIconModule } from '@angular/material/icon';
import { MomentModule } from 'ngx-moment';

/** Routed module for banning users. */
@NgModule({
  declarations: [
    CommunityMessagingComponent,
    SunriseCommunityMessagingComponent,
    NewCommunityMessageComponent,
  ],
  imports: [
    CommunityMessagingRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PlayerSelectionModule,
    LspGroupSelectionModule,
    VerifyActionButtonModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatDatepickerModule,
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
    MomentModule,
  ],
})
export class CommunityMessagingModule {}
