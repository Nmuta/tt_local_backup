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
import { OpusGiftBasketComponent } from './opus/opus-gift-basket.component';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';

/** The feature module for the User Details route. */
@NgModule({
  declarations: [
    GravityGiftBasketComponent,
    SunriseGiftBasketComponent,
    ApolloGiftBasketComponent,
    OpusGiftBasketComponent,
  ],
  imports: [
    CommonModule,
    ErrorSpinnerModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    PipesModule,
    JsonDumpModule,
  ],
  exports: [
    GravityGiftBasketComponent,
    SunriseGiftBasketComponent,
    ApolloGiftBasketComponent,
    OpusGiftBasketComponent,
  ],
})
export class GiftBasketModule {}
