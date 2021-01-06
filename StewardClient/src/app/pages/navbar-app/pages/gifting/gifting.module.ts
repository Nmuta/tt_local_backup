import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { GiftingComponent } from './gifting.component';
import { GiftingRouterModule } from './gifting.routing';
import { PlayerSelectionModule } from '../../components/player-selection/player-selection.module';
import { TitleDropdownModule } from '@components/title-dropdown/title-dropdown.module';
import { GravityGiftingComponent } from './gravity/gravity-gifting.component';
import { SunriseGiftingComponent } from './sunrise/sunrise-gifting.component';
import { ApolloGiftingComponent } from './apollo/apollo-gifting.component';
import { OpusGiftingComponent } from './opus/opus-gifting.component';
import { MatCardModule } from '@angular/material/card';

/** The feature module for the User Details route. */
@NgModule({
  declarations: [
    GiftingComponent,
    GravityGiftingComponent,
    SunriseGiftingComponent,
    ApolloGiftingComponent,
    OpusGiftingComponent,
  ],
  imports: [
    CommonModule,
    ErrorSpinnerModule,
    GiftingRouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatCardModule,
    FontAwesomeModule,
    FormsModule,
    PlayerSelectionModule,
    TitleDropdownModule,
  ],
})
export class GiftingsModule {}
