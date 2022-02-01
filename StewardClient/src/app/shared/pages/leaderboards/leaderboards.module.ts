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
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { LeaderboardsComponent } from './leaderboards.component';
import { MatTabsModule } from '@angular/material/tabs';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { MonitorActionModule } from '@shared/modules/monitor-action/monitor-action.module';
import { ReportedScoresComponent } from './components/reported-scores/reported-scores.component';
import { SearchLeaderboardsComponent } from './components/search-leaderboards/search-leaderboards.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { LeaderboardScoresComponent } from './components/leaderboard-scores/leaderboard-scores.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { EndpointSelectionModule } from '@views/endpoint-selection/endpoint-selection.module';
import { WoodstockLeaderboardsComponent } from './woodstock/woodstock-leaderboards.component';
import { WoodstockSearchLeaderboardsComponent } from './components/search-leaderboards/woodstock/woodstock-search-leaderboards.component';
import { WoodstockLeaderboardScoresComponent } from './components/leaderboard-scores/woodstock/woodstock-leaderboard-scores.component';
import { DirectivesModule } from '@shared/directives/directives.module';
import { PipesModule } from '@shared/pipes/pipes.module';
import { LuxonDateModule } from 'ngx-material-luxon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { VerifyActionButtonModule } from '@components/verify-action-button/verify-action-button.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { StateManagersModule } from '@shared/modules/state-managers/state-managers.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';

/** Module for displaying leaderboard management tools. */
@NgModule({
  declarations: [
    LeaderboardsComponent,
    ReportedScoresComponent,
    WoodstockLeaderboardsComponent,

    SearchLeaderboardsComponent,
    WoodstockSearchLeaderboardsComponent,

    LeaderboardScoresComponent,
    WoodstockLeaderboardScoresComponent,
  ],
  imports: [
    LeaderboardsRoutingModule,
    CommonModule,
    DirectivesModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatTooltipModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatIconModule,
    MatOptionModule,
    MatAutocompleteModule,
    MatTableModule,
    MatPaginatorModule,
    MatTabsModule,
    MatChipsModule,
    MatSelectModule,
    MatIconModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatSnackBarModule,
    TextFieldModule,
    JsonDumpModule,
    VerifyActionButtonModule,
    MatProgressSpinnerModule,
    ErrorSpinnerModule,
    MonitorActionModule,
    EndpointSelectionModule,
    StateManagersModule,
    PipesModule,
    LuxonDateModule,
  ],
  exports: [ReportedScoresComponent, SearchLeaderboardsComponent],
})
export class LeaderboardsModule {}
