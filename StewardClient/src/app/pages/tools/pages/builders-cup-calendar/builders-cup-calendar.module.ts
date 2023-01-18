import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DataPrivacyNoticeModule } from '@views/data-privacy-notice/data-privacy-notice.module';
import { FourOhFourModule } from '@views/four-oh-four/four-oh-four.module';
import { SidebarIconsModule } from '@views/sidebar-icons/sidebar-icons.module';
import { SidebarsModule } from 'app/sidebars/sidebars.module';
import { PipesModule } from '@shared/pipes/pipes.module';
import { DirectivesModule } from '@shared/directives/directives.module';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ThemeModule } from '@shared/modules/theme/theme.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { EndpointSelectionModule } from '@views/endpoint-selection/endpoint-selection.module';
import { MatDialogModule } from '@angular/material/dialog';
import { LuxonModule } from 'luxon-angular';
import { MatLuxonDateModule } from 'ngx-material-luxon';
import { MatExpansionModule } from '@angular/material/expansion';
import { PlayerSelectionModule } from '@views/player-selection/player-selection.module';
import { MatInputModule } from '@angular/material/input';
import { MonitorActionModule } from '@shared/modules/monitor-action/monitor-action.module';
import { StandardDateModule } from '@components/standard-date/standard-date.module';
import { MatTabsModule } from '@angular/material/tabs';
import { angularCalendarCustomFactory } from '@helpers/angular-calendar-custom-factory';
import { ModelDumpModule } from '@shared/modules/model-dump/model-dump.module';
import { BuildersCupCalendarRoutingModule } from './builders-cup-calendar.routing';
import { BuildersCupCalendarComponent } from './builders-cup-calendar.component';

/** A module for Welcome Center calendar. */
@NgModule({
  declarations: [
    BuildersCupCalendarComponent,
    SteelheadBuildersCupCalendarViewComponent,
  ],
  imports: [
    CommonModule,
    DataPrivacyNoticeModule,
    FontAwesomeModule,
    FontAwesomeModule,
    FourOhFourModule,
    MatBadgeModule,
    MatButtonModule,
    MatCardModule,
    MatBadgeModule,
    SidebarIconsModule,
    MatIconModule,
    MatSidenavModule,
    MatToolbarModule,
    MatTooltipModule,
    MatMenuModule,
    SidebarsModule,
    MatCardModule,
    DragDropModule,
    MatCheckboxModule,
    FormsModule,
    PipesModule,
    DirectivesModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatExpansionModule,
    ThemeModule,
    EndpointSelectionModule,
    MatDialogModule,
    MatLuxonDateModule,
    LuxonModule,
    PlayerSelectionModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MonitorActionModule,
    StandardDateModule,
    MatTabsModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatTreeModule,
    BuildersCupCalendarRoutingModule,
    ModelDumpModule,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: angularCalendarCustomFactory }),
  ],
})
export class BuildersCupCalendarModule {}
