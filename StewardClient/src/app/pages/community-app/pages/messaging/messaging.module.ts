import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { TextFieldModule } from '@angular/cdk/text-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommunityMessagingRoutingModule } from './messaging.routing';
import { CommunityMessagingComponent } from './messaging.component';

/** Module for displaying the community messaging page. */
@NgModule({
  declarations: [CommunityMessagingComponent],
  imports: [
    CommunityMessagingRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatTooltipModule,
    TextFieldModule,
    JsonDumpModule,
    MatProgressSpinnerModule,
  ],
  exports: [CommunityMessagingComponent],
})
export class CommunityMessagingModule {}
