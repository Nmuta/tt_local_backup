import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { LeaderboardsRoutingModule } from './leaderboards.routing';
import { TextFieldModule } from '@angular/cdk/text-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { LeaderboardsComponent } from './leaderboards.component';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { MonitorActionModule } from '@shared/modules/monitor-action/monitor-action.module';
import { ReportedScoresComponent } from './components/reported-scores/reported-scores.component';
import { SearchLeaderboardsComponent } from './components/search-leaderboards/search-leaderboards.component';
import { LeaderboardScoresComponent } from './components/leaderboard-scores/leaderboard-scores.component';
import { EndpointSelectionModule } from '@views/endpoint-selection/endpoint-selection.module';
import { WoodstockLeaderboardsComponent } from './woodstock/woodstock-leaderboards.component';
import { WoodstockSearchLeaderboardsComponent } from './components/search-leaderboards/woodstock/woodstock-search-leaderboards.component';
import { WoodstockLeaderboardScoresComponent } from './components/leaderboard-scores/woodstock/woodstock-leaderboard-scores.component';
import { DirectivesModule } from '@shared/directives/directives.module';
import { PipesModule } from '@shared/pipes/pipes.module';
import { StateManagersModule } from '@shared/modules/state-managers/state-managers.module';
import { LeaderboardStatsComponent } from './components/leaderboard-stats/leaderboard-stats.component';
import { WoodstockLeaderboardStatsComponent } from './components/leaderboard-stats/woodstock/woodstock-leaderboard-stats.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { StandardDateModule } from '@components/standard-date/standard-date.module';
import { VerifyCheckboxModule } from '@shared/modules/verify/verify-checkbox.module';
import { LuxonModule } from 'luxon-angular';
import { LeaderboardValidationsComponent } from './components/leaderboard-validations/leaderboard-validations.component';
import { HelpModule } from '@shared/modules/help/help.module';
import { StandardCopyModule } from '@shared/modules/standard-copy/standard-copy.module';
import { PlayerSelectionModule } from '@views/player-selection/player-selection.module';
import { MatMenuModule } from '@angular/material/menu';
import { DateTimePickersModule } from '@components/date-time-pickers/date-time-pickers.module';
import { StandardFlagModule } from '@components/standard-flag/standard-flag.module';
import { PermissionsModule } from '@shared/modules/permissions/permissions.module';
import { SteelheadLeaderboardsComponent } from './steelhead/steelhead-leaderboards.component';
import { SteelheadSearchLeaderboardsComponent } from './components/search-leaderboards/steelhead/steelhead-search-leaderboards.component';
import { SteelheadLeaderboardStatsComponent } from './components/leaderboard-stats/steelhead/steelhead-leaderboard-stats.component';
import { SteelheadLeaderboardScoresComponent } from './components/leaderboard-scores/steelhead/steelhead-leaderboard-scores.component';

/** Module for displaying leaderboard management tools. */
@NgModule({
  declarations: [
    LeaderboardsComponent,
    ReportedScoresComponent,
    WoodstockLeaderboardsComponent,
    SteelheadLeaderboardsComponent,

    SearchLeaderboardsComponent,
    WoodstockSearchLeaderboardsComponent,
    SteelheadSearchLeaderboardsComponent,

    LeaderboardScoresComponent,
    WoodstockLeaderboardScoresComponent,
    SteelheadLeaderboardScoresComponent,

    LeaderboardStatsComponent,
    WoodstockLeaderboardStatsComponent,
    SteelheadLeaderboardStatsComponent,

    LeaderboardValidationsComponent,
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
    MatIconModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatButtonToggleModule,
    TextFieldModule,
    JsonDumpModule,
    MatProgressSpinnerModule,
    ErrorSpinnerModule,
    MonitorActionModule,
    EndpointSelectionModule,
    StateManagersModule,
    NgxChartsModule,
    StandardDateModule,
    StandardCopyModule,
    VerifyCheckboxModule,
    PipesModule,
    LuxonModule,
    DateTimePickersModule,
    HelpModule,
    PlayerSelectionModule,
    MatMenuModule,
    StandardFlagModule,
    PermissionsModule,
  ],
  exports: [],
})
export class LeaderboardsModule {}
