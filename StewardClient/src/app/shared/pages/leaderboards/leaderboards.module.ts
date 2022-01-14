import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { LeaderboardsRoutingModule } from './leaderboards.routing';
import { MatInputModule } from '@angular/material/input';
import { TextFieldModule } from '@angular/cdk/text-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { KustoQuerySelectionModule } from '../kusto/component/kusto-query-selection/kusto-query-selection.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { LeaderboardsComponent } from './leaderboards.component';
import { MatTabsModule } from '@angular/material/tabs';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { MonitorActionModule } from '@shared/modules/monitor-action/monitor-action.module';
import { ReportedScoresComponent } from './components/reported-scores/reported-scores.component';
import { SearchLeaderboardsComponent } from './components/search-leaderboards/search-leaderboards.component';

/** Module for displaying the available apps, or a login button. */
@NgModule({
  declarations: [LeaderboardsComponent, ReportedScoresComponent, SearchLeaderboardsComponent],
  imports: [
    LeaderboardsRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatTooltipModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatIconModule,
    MatOptionModule,
    MatTableModule,
    MatTabsModule,
    TextFieldModule,
    JsonDumpModule,
    MatProgressSpinnerModule,
    KustoQuerySelectionModule,
    ErrorSpinnerModule,
    MonitorActionModule,
  ],
  exports: [ReportedScoresComponent, SearchLeaderboardsComponent],
})
export class LeaderboardsModule {}
