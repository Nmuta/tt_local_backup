import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolsAppHomeComponent } from './pages/home/home.component';
import { ToolsAppComponent } from './tools-app.component';
import { ToolsAppRouterModule } from './tools-app.routing';
import { NavbarComponent } from './components/navbar/navbar.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DataPrivacyNoticeModule } from '@views/data-privacy-notice/data-privacy-notice.module';
import { FourOhFourModule } from '@views/four-oh-four/four-oh-four.module';
import { SidebarIconsModule } from '@views/sidebar-icons/sidebar-icons.module';
import { SidebarsModule } from 'app/sidebars/sidebars.module';
import { PipesModule } from '@shared/pipes/pipes.module';
import { DirectivesModule } from '@shared/directives/directives.module';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ThemeModule } from '@shared/modules/theme/theme.module';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { NavModule } from '@shared/modules/nav/nav.module';
import { EndpointsModule } from '@shared/modules/endpoints/endpoints.module';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { ToolsAppHomeTileGridComponent } from './pages/home/components/home-tile-grid/home-tile-grid.component';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { MonitorActionModule } from '@shared/modules/monitor-action/monitor-action.module';
import { TourMatMenuModule } from 'ngx-ui-tour-md-menu';

/** A module for all tools, with a configurable navbar. */
@NgModule({
  declarations: [
    ToolsAppHomeComponent,
    ToolsAppHomeTileGridComponent,
    ToolsAppComponent,
    NavbarComponent,
  ],
  imports: [
    ToolsAppRouterModule,
    NavModule,
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
    ThemeModule,
    EndpointsModule,
    MatChipsModule,
    MatInputModule,
    MatAutocompleteModule,
    MatInputModule,
    MatTabsModule,
    ReactiveFormsModule,
    MonitorActionModule,
    TourMatMenuModule, // loaded to ensure tours run properly
  ],
})
export class ToolsAppModule {}
