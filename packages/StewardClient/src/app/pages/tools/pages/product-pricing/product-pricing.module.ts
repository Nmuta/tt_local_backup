import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { PipesModule } from '@shared/pipes/pipes.module';
import { OverviewModule } from '@shared/views/overview/overview.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { EndpointSelectionModule } from '@views/endpoint-selection/endpoint-selection.module';
import { MonitorActionModule } from '@shared/modules/monitor-action/monitor-action.module';
import { StateManagersModule } from '@shared/modules/state-managers/state-managers.module';
import { RouterModule } from '@angular/router';
import { DirectivesModule } from '@shared/directives/directives.module';
import { PermissionsModule } from '@shared/modules/permissions/permissions.module';
import { HelpModule } from '@shared/modules/help/help.module';
import { ProductPricingComponent } from './product-pricing.component';
import { ProductPricingRouterModule } from './product-pricing.routing';
import { MatTableModule } from '@angular/material/table';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

/** The feature module for the Product Pricing route. */
@NgModule({
  declarations: [ProductPricingComponent],
  imports: [
    CommonModule,
    ErrorSpinnerModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatCardModule,
    FontAwesomeModule,
    FormsModule,
    CommonModule,
    PipesModule,
    OverviewModule,
    JsonDumpModule,
    MatTooltipModule,
    EndpointSelectionModule,
    MonitorActionModule,
    StateManagersModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    DirectivesModule,
    PermissionsModule,
    MatIconModule,
    HelpModule,
    ProductPricingRouterModule,
    MatTableModule,
    MatAutocompleteModule,
  ],
  exports: [ProductPricingComponent],
})
export class ProductPricingModule {}
