import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { TextFieldModule } from '@angular/cdk/text-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MonitorActionModule } from '@shared/modules/monitor-action/monitor-action.module';
import { PipesModule } from '@shared/pipes/pipes.module';
import { StewardUserModule } from '@views/steward-user/steward-user.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { LuxonModule } from 'luxon-angular';
import { StateManagersModule } from '@shared/modules/state-managers/state-managers.module';
import { EndpointSelectionModule } from '@views/endpoint-selection/endpoint-selection.module';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PermissionsModule } from '@shared/modules/permissions/permissions.module';
import { VerifyCheckboxModule } from '@shared/modules/verify/verify-checkbox.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { UnifiedCalendarComponent } from './unified-calendar.component';
import { UnifiedCalendarRoutingModule } from './unified-calendar.routing';
import { SteelheadUnifiedCalendarComponent } from './steelhead/steelhead-unified-calendar.component';
import { RacersCupSeriesModalComponent } from './steelhead/components/racers-cup/racers-cup-series-modal/racers-cup-series-modal.component';
import { RacersCupCalendarComponent } from './steelhead/components/racers-cup/racers-cup-calendar/racers-cup-calendar.component';
import { RacersCupEventCardComponent } from './steelhead/components/racers-cup/racers-cup-event-card/racers-cup-event-card.component';
import { RacersCupInputsComponent } from './steelhead/components/racers-cup/racers-cup-inputs/racers-cup-inputs.component';
import { RacersCupKeyComponent } from './steelhead/components/racers-cup/racers-cup-key/racers-cup-key.component';
import { DataPrivacyNoticeModule } from '@views/data-privacy-notice/data-privacy-notice.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FourOhFourModule } from '@views/four-oh-four/four-oh-four.module';
import { MatBadgeModule } from '@angular/material/badge';
import { SidebarIconsModule } from '@views/sidebar-icons/sidebar-icons.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { SidebarsModule } from 'app/sidebars/sidebars.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DirectivesModule } from '@shared/directives/directives.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ThemeModule } from '@shared/modules/theme/theme.module';
import { MatLuxonDateModule } from 'ngx-material-luxon';
import { PlayerSelectionModule } from '@views/player-selection/player-selection.module';
import { StandardDateModule } from '@components/standard-date/standard-date.module';
import { MatTreeModule } from '@angular/material/tree';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { angularCalendarCustomFactory } from '@helpers/angular-calendar-custom-factory';
import { SteelheadBuildersCupCalendarViewComponent } from './steelhead/components/builders-cup/builders-cup-calendar-view/steelhead/steelhead-builders-cup-calendar-view.component';
import { SteelheadBuildersCupSeriesCardComponent } from './steelhead/components/builders-cup/builders-cup-series-card/steelhead/steelhead-builders-cup-series-card.component';
import { SteelheadBuildersCupLadderModalComponent } from './steelhead/components/builders-cup/builders-cup-ladder-modal/steelhead/steelhead-builders-cup-ladder-modal.component';
import { BuildersCupKeyComponent } from './steelhead/components/builders-cup/builders-cup-key/builders-cup-key.component';
import { SteelheadWelcomeCenterCalendarViewComponent } from './steelhead/components/welcome-center/welcome-center-calendar-view/steelhead/steelhead-welcome-center-calendar-view.component';
import { WelcomeCenterTileDetailsModalComponent } from './steelhead/components/welcome-center/welcome-center-tile-details-modal/steelhead/welcome-center-tile-details-modal.component';

/** Module for the PlayFab tool. */
@NgModule({
  declarations: [
    UnifiedCalendarComponent,
    SteelheadUnifiedCalendarComponent,

    RacersCupCalendarComponent,
    RacersCupEventCardComponent,
    RacersCupInputsComponent,
    RacersCupKeyComponent,
    RacersCupSeriesModalComponent,

    SteelheadBuildersCupCalendarViewComponent,
    SteelheadBuildersCupSeriesCardComponent,
    SteelheadBuildersCupLadderModalComponent,
    BuildersCupKeyComponent,

    SteelheadWelcomeCenterCalendarViewComponent,
    WelcomeCenterTileDetailsModalComponent,
  ],
  imports: [
    UnifiedCalendarRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatTooltipModule,
    MatSelectModule,
    MatIconModule,
    MatOptionModule,
    MatTableModule,
    MatTabsModule,
    MatCheckboxModule,
    MatDialogModule,
    MatToolbarModule,
    MatPaginatorModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatExpansionModule,
    TextFieldModule,
    JsonDumpModule,
    MatProgressSpinnerModule,
    MonitorActionModule,
    StewardUserModule,
    PipesModule,
    LuxonModule,
    StateManagersModule,
    EndpointSelectionModule,
    PermissionsModule,
    VerifyCheckboxModule,

    DataPrivacyNoticeModule,
    FontAwesomeModule,
    FontAwesomeModule,
    FourOhFourModule,
    MatBadgeModule,
    SidebarIconsModule,
    MatSidenavModule,
    MatMenuModule,
    SidebarsModule,
    DragDropModule,
    DirectivesModule,
    MatFormFieldModule,
    ThemeModule,
    MatLuxonDateModule,
    PlayerSelectionModule,
    StandardDateModule,
    MatTreeModule,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: angularCalendarCustomFactory }),
  ],
})
export class UnifiedCalendarModule {}
