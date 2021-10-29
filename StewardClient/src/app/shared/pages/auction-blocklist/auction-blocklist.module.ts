import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PipesModule } from '@shared/pipes/pipes.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { DirectivesModule } from '@shared/directives/directives.module';
import { AuctionBlocklistComponent } from './auction-blocklist.component';
import { AuctionBlocklistRoutingModule } from './auction-blocklist.routing';
import { SunriseAuctionBlocklistComponent } from './sunrise/sunrise-auction-blocklist.component';
import { MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import { STANDARD_DATE_IMPORTS } from '@helpers/standard-imports';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OverrideManagersModule } from '@shared/modules/state-managers/state-managers.module';
import { MonitorActionModule } from '@shared/modules/monitor-action/monitor-action.module';
import { MakeModelAutocompleteModule } from '@views/make-model-autocomplete/make-model-autocomplete.module';
import { EndpointSelectionModule } from '@views/endpoint-selection/endpoint-selection.module';
import { AuctionBlocklistBaseComponent } from './base/auction-blocklist.base.component';
import { WoodstockAuctionBlocklistComponent } from './woodstock/woodstock-auction-blocklist.component';
import { AuctionBlocklistNewEntryComponent } from './components/auction-blocklist-new-entry/auction-blocklist-new-entry.component';
import { SunriseAuctionBlocklistNewEntryComponent } from './components/auction-blocklist-new-entry/sunrise/sunrise-auction-blocklist-new-entry.component';
import { WoodstockAuctionBlocklistNewEntryComponent } from './components/auction-blocklist-new-entry/woodstock/woodstock-auction-blocklist-new-entry.component';

/** Routed module for viewing steward user history. */
@NgModule({
  declarations: [
    AuctionBlocklistComponent,
    AuctionBlocklistBaseComponent,
    SunriseAuctionBlocklistComponent,
    WoodstockAuctionBlocklistComponent,
    AuctionBlocklistNewEntryComponent,
    SunriseAuctionBlocklistNewEntryComponent,
    WoodstockAuctionBlocklistNewEntryComponent,
  ],
  imports: [
    ...STANDARD_DATE_IMPORTS,
    CommonModule,
    DirectivesModule,
    FontAwesomeModule,
    FormsModule,
    JsonDumpModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatToolbarModule,
    MonitorActionModule,
    OverrideManagersModule,
    PipesModule,
    ReactiveFormsModule,
    AuctionBlocklistRoutingModule,
    MakeModelAutocompleteModule,
    EndpointSelectionModule,
  ],
})
export class StewardAuctionBlocklistModule {}