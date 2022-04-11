import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UgcComponent } from './ugc.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { UGCRoutingModule } from './ugc.routing';
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
import { BanHistoryModule } from '@shared/views/ban-history/ban-history.module';
import { PlayerSelectionModule } from '@shared/views/player-selection/player-selection.module';
import { PipesModule } from '@shared/pipes/pipes.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { DirectivesModule } from '@shared/directives/directives.module';
import { MatTabsModule } from '@angular/material/tabs';
import { PlayerUGCModule } from '@views/player-ugc/player-ugc.module';
import { MatIconModule } from '@angular/material/icon';
import { EndpointSelectionModule } from '@views/endpoint-selection/endpoint-selection.module';
import { PastableSingleInputModule } from '@views/pastable-single-input/pastable-single-input.module';

/** Routed module for ugc users. */
@NgModule({
  declarations: [UgcComponent],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    UGCRoutingModule,
    PlayerSelectionModule,
    VerifyActionButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatProgressSpinnerModule,
    FontAwesomeModule,
    MatChipsModule,
    BanHistoryModule,
    PipesModule,
    JsonDumpModule,
    DirectivesModule,
    MatTabsModule,
    PlayerUGCModule,
    MatIconModule,
    PastableSingleInputModule,
    EndpointSelectionModule,
  ],
})
export class UGCModule {}
