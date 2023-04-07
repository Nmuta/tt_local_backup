import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { WelcomeCenterTilesComponent } from './welcome-center-tiles.component';
import { WelcomeCenterTilesRouterModule } from './welcome-center-tiles.routing';
import { SteelheadWelcomeCenterTilesComponent } from './steelhead/steelhead-welcome-center-tiles.component';
import { MatTabsModule } from '@angular/material/tabs';
import { LocalizationModule } from '@components/localization/localization.module';
import { EndpointSelectionModule } from '@views/endpoint-selection/endpoint-selection.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DirectivesModule } from '@shared/directives/directives.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { MonitorActionModule } from '@shared/modules/monitor-action/monitor-action.module';
import { StateManagersModule } from '@shared/modules/state-managers/state-managers.module';
import { PipesModule } from '@shared/pipes/pipes.module';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { DateTimePickersModule } from '@components/date-time-pickers/date-time-pickers.module';
import { LuxonDateModule } from 'ngx-material-luxon';
import { StandardDateModule } from '@components/standard-date/standard-date.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { PermissionsModule } from '@shared/modules/permissions/permissions.module';
import { LuxonModule } from 'luxon-angular';
import { VerifyCheckboxModule } from '@shared/modules/verify/verify-checkbox.module';
import { GeneralTileComponent } from './steelhead/tile-components/steelhead-general-tile.component';
import { ImageTextTileComponent } from './steelhead/tile-components/image-text/steelhead-image-text-tile.component';
import { GenericPopupTileComponent } from './steelhead/tile-components/generic-popup/steelhead-generic-popup-tile.component';
import { DeeplinkTileComponent } from './steelhead/tile-components/deeplink/steelhead-deeplink-tile.component';

/** Module for displaying welcome center tiles tool. */
@NgModule({
  declarations: [
    WelcomeCenterTilesComponent,
    SteelheadWelcomeCenterTilesComponent,
    ImageTextTileComponent,
    GeneralTileComponent,
    GenericPopupTileComponent,
    DeeplinkTileComponent,
  ],
  imports: [
    WelcomeCenterTilesRouterModule,
    CommonModule,
    MatTabsModule,
    LocalizationModule,
    EndpointSelectionModule,
    DirectivesModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    RouterModule,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    MatInputModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatTableModule,
    MonitorActionModule,
    StateManagersModule,
    PipesModule,
    MatOptionModule,
    MatSelectModule,
    DateTimePickersModule,
    LuxonDateModule,
    StandardDateModule,
    MatDatepickerModule,
    PermissionsModule,
    LuxonModule,
    VerifyCheckboxModule,
  ],
  exports: [],
})
export class WelcomeCenterTilesModule {}
