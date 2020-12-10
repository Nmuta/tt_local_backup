import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';

import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ApolloPlayerSelectionComponent } from './apollo/apollo-player-selection.component';
import { GravityPlayerSelectionComponent } from './gravity/gravity-player-selection.component';
import { SunrisePlayerSelectionComponent } from './sunrise/sunrise-player-selection.component';
import { OpusPlayerSelectionComponent } from './opus/opus-player-selection.component';
import { ContentCollapseModule } from '@components/content-collapse/content-collapse.module';

/** The feature module for the User Details route. */
@NgModule({
  declarations: [
    GravityPlayerSelectionComponent,
    SunrisePlayerSelectionComponent,
    ApolloPlayerSelectionComponent,
    OpusPlayerSelectionComponent,
  ],
  imports: [
    CommonModule,
    ErrorSpinnerModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatCardModule,
    MatButtonToggleModule,
    MatProgressSpinnerModule,
    MatTableModule,
    FontAwesomeModule,
    FormsModule,
    ContentCollapseModule,
  ],
  exports: [
    GravityPlayerSelectionComponent,
    SunrisePlayerSelectionComponent,
    ApolloPlayerSelectionComponent,
    OpusPlayerSelectionComponent,
  ],
})
export class PlayerSelectionModule {}
