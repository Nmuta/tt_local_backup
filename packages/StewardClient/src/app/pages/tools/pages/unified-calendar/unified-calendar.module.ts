import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { TextFieldModule } from '@angular/cdk/text-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyOptionModule as MatOptionModule } from '@angular/material/legacy-core';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { MonitorActionModule } from '@shared/modules/monitor-action/monitor-action.module';
import { PipesModule } from '@shared/pipes/pipes.module';
import { StewardUserModule } from '@views/steward-user/steward-user.module';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { LuxonModule } from 'luxon-angular';
import { StateManagersModule } from '@shared/modules/state-managers/state-managers.module';
import { EndpointSelectionModule } from '@views/endpoint-selection/endpoint-selection.module';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { PermissionsModule } from '@shared/modules/permissions/permissions.module';
import { VerifyButtonModule } from '@shared/modules/verify/verify-button.module';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { UnifiedCalendarComponent } from './unified-calendar.component';
import { UnifiedCalendarRoutingModule } from './unified-calendar.routing';
import { SteelheadUnifiedCalendarComponent } from './steelhead/steelhead-unified-calendar.component';
import { RacersCupSeriesModalComponent } from './steelhead/components/racers-cup/racers-cup-series-modal/racers-cup-series-modal.component';
import { RacersCupCalendarComponent } from './steelhead/components/racers-cup/racers-cup-calendar/racers-cup-calendar.component';
import { RacersCupEventCardComponent } from './steelhead/components/racers-cup/racers-cup-event-card/racers-cup-event-card.component';
import { RacersCupKeyComponent } from './steelhead/components/racers-cup/racers-cup-key/racers-cup-key.component';
import { DataPrivacyNoticeModule } from '@views/data-privacy-notice/data-privacy-notice.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FourOhFourModule } from '@views/four-oh-four/four-oh-four.module';
import { MatBadgeModule } from '@angular/material/badge';
import { SidebarIconsModule } from '@views/sidebar-icons/sidebar-icons.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { SidebarsModule } from 'app/sidebars/sidebars.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DirectivesModule } from '@shared/directives/directives.module';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
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
import { RivalsTileDetailsModalComponent } from './steelhead/components/rivals/components/rivals-tile-details-modal/rivals-tile-details-modal.component';
import { SteelheadRivalsCalendarViewComponent } from './steelhead/components/rivals/components/rivals-calendar-view/steelhead-rivals-calendar-view.component';
import { SteelheadShowroomCalendarViewComponent } from './steelhead/components/showroom/showroom-calendar-view/steelhead/steelhead-showroom-calendar-view.component';
import { ShowroomCarFeaturedTileDetailsModalComponent } from './steelhead/components/showroom/showroom-car-featured-tile-details-modal/steelhead/showroom-car-featured-tile-details-modal.component';
import { ShowroomDivisionFeaturedTileDetailsModalComponent } from './steelhead/components/showroom/showroom-division-featured-tile-details-modal/steelhead/showroom-division-featured-tile-details-modal.component';
import { ShowroomManufacturerFeaturedTileDetailsModalComponent } from './steelhead/components/showroom/showroom-manufacturer-featured-tile-details-modal/steelhead/showroom-manufacturer-featured-tile-details-modal.component';
import { ShowroomSaleTileDetailsModalComponent } from './steelhead/components/showroom/showroom-sale-tile-details-modal/steelhead/showroom-sale-tile-details-modal.component';
import { ShowroomKeyComponent } from './steelhead/components/showroom/showroom-key/showroom-key.component';
import { CalendarLookupInputsComponent } from './steelhead/components/calendar-lookup-inputs/calendar-lookup-inputs.component';

/** Module for the PlayFab tool. */
@NgModule({
  declarations: [
    UnifiedCalendarComponent,
    SteelheadUnifiedCalendarComponent,

    CalendarLookupInputsComponent,

    RacersCupCalendarComponent,
    RacersCupEventCardComponent,
    RacersCupKeyComponent,
    RacersCupSeriesModalComponent,

    SteelheadBuildersCupCalendarViewComponent,
    SteelheadBuildersCupSeriesCardComponent,
    SteelheadBuildersCupLadderModalComponent,
    BuildersCupKeyComponent,

    SteelheadWelcomeCenterCalendarViewComponent,
    WelcomeCenterTileDetailsModalComponent,

    RivalsTileDetailsModalComponent,
    SteelheadRivalsCalendarViewComponent,

    SteelheadShowroomCalendarViewComponent,
    ShowroomSaleTileDetailsModalComponent,
    ShowroomCarFeaturedTileDetailsModalComponent,
    ShowroomDivisionFeaturedTileDetailsModalComponent,
    ShowroomManufacturerFeaturedTileDetailsModalComponent,
    ShowroomKeyComponent,
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
    VerifyButtonModule,

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
