import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PipesModule } from '@shared/pipes/pipes.module';
import { GravityGiftBasketComponent } from './gravity/gravity-gift-basket.component';
import { SunriseGiftBasketComponent } from './sunrise/sunrise-gift-basket.component';
import { ApolloGiftBasketComponent } from './apollo/apollo-gift-basket.component';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { ItemSelectionModule } from '../item-selection/item-selection.module';
import { GiftingResultModule } from '../gifting-result/gifting-result.module';
import { SteelheadGiftBasketComponent } from './steelhead/steelhead-gift-basket.component';
import { WoodstockGiftBasketComponent } from './woodstock/woodstock-gift-basket.component';
import { MatIconModule } from '@angular/material/icon';
import { HelpModule } from '@shared/modules/help/help.module';

/** The gift basket module. */
@NgModule({
  declarations: [
    WoodstockGiftBasketComponent,
    SteelheadGiftBasketComponent,
    GravityGiftBasketComponent,
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
  ],
  exports: [
    WoodstockGiftBasketComponent,
    SteelheadGiftBasketComponent,
    GravityGiftBasketComponent,
    SunriseGiftBasketComponent,
    ApolloGiftBasketComponent,
  ],
})
export class GiftBasketModule {}
