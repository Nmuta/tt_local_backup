import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolsAppHomeComponent } from './pages/home/home.component';
import { ToolsAppComponent } from './tools-app.component';
import { ToolsAppRouterModule } from './tools-app.routing';
import { NavbarComponent } from './components/navbar/navbar.component';
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
import { NavModule } from '@shared/modules/nav/nav.module';
import { EndpointsModule } from '@shared/modules/endpoints/endpoints.module';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ToolsAppHomeTileGridComponent } from './pages/home/components/home-tile-grid/home-tile-grid.component';
import { MatTabsModule } from '@angular/material/tabs';
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
    TourMatMenuModule,    // loaded to ensure tours run properly
  ],
})
export class ToolsAppModule {}
