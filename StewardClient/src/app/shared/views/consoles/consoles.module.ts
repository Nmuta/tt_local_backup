import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { MatTableModule } from '@angular/material/table';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PipesModule } from '@shared/pipes/pipes.module';
import { VerifyActionButtonModule } from '@components/verify-action-button/verify-action-button.module';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { ApolloConsolesComponent } from './apollo/apollo-consoles.component';
import { SunriseConsolesComponent } from './sunrise/sunrise-consoles.component';
import { SteelheadConsolesComponent } from './steelhead/steelhead-consoles.component';
import { WoodstockConsolesComponent } from './woodstock/woodstock-consoles.component';
import { MatIconModule } from '@angular/material/icon';

/** A domain module for displaying related console lists. */
@NgModule({
  declarations: [
    WoodstockConsolesComponent,
    SteelheadConsolesComponent,
    SunriseConsolesComponent,
    ApolloConsolesComponent,
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatTableModule,
    FontAwesomeModule,
    PipesModule,
    VerifyActionButtonModule,
    ErrorSpinnerModule,
    JsonDumpModule,
    MatIconModule,
  ],
  exports: [
    WoodstockConsolesComponent,
    SteelheadConsolesComponent,
    SunriseConsolesComponent,
    ApolloConsolesComponent,
  ],
})
export class ConsolesModule {}
