import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { PipesModule } from '@shared/pipes/pipes.module';
import { SunriseGiftBasketComponent } from './sunrise/sunrise-gift-basket.component';
import { ApolloGiftBasketComponent } from './apollo/apollo-gift-basket.component';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatLegacyOptionModule as MatOptionModule } from '@angular/material/legacy-core';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { ItemSelectionModule } from '../item-selection/item-selection.module';
import { GiftingResultModule } from '../gifting-result/gifting-result.module';
import { SteelheadGiftBasketComponent } from './steelhead/steelhead-gift-basket.component';
import { WoodstockGiftBasketComponent } from './woodstock/woodstock-gift-basket.component';
import { MatIconModule } from '@angular/material/icon';
import { HelpModule } from '@shared/modules/help/help.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { LocalizationModule } from '@components/localization/localization.module';
import { StateManagersModule } from '@shared/modules/state-managers/state-managers.module';
import { PermissionsModule } from '@shared/modules/permissions/permissions.module';

/** The gift basket module. */
@NgModule({
  declarations: [
    WoodstockGiftBasketComponent,
    SteelheadGiftBasketComponent,
    SunriseGiftBasketComponent,
    ApolloGiftBasketComponent,
  ],
  imports: [
    CommonModule,
    ErrorSpinnerModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatSelectModule,
    MatTableModule,
    MatTooltipModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    PipesModule,
    JsonDumpModule,
    ItemSelectionModule,
    GiftingResultModule,
    MatIconModule,
    HelpModule,
    MatDatepickerModule,
    MatCheckboxModule,
    LocalizationModule,
    StateManagersModule,
    PermissionsModule,
  ],
  exports: [
    WoodstockGiftBasketComponent,
    SteelheadGiftBasketComponent,
    SunriseGiftBasketComponent,
    ApolloGiftBasketComponent,
  ],
})
export class GiftBasketModule {}
