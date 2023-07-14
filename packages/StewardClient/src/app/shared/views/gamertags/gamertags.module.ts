import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PipesModule } from '@shared/pipes/pipes.module';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { MatTableModule } from '@angular/material/table';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterModule } from '@angular/router';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { SunriseGamertagsComponent } from './sunrise/sunrise-gamertags.component';
import { ApolloGamertagsComponent } from './apollo/apollo-gamertags.component';
import { SteelheadGamertagsComponent } from './steelhead/steelhead-gamertags.component';
import { WoodstockGamertagsComponent } from './woodstock/woodstock-gamertags.component';
import { MatIconModule } from '@angular/material/icon';

/** A domain module for displaying related gamertags. */
@NgModule({
  declarations: [
    WoodstockGamertagsComponent,
    SteelheadGamertagsComponent,
    SunriseGamertagsComponent,
    ApolloGamertagsComponent,
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatIconModule,
    FontAwesomeModule,
    RouterModule,
    PipesModule,
    ErrorSpinnerModule,
    JsonDumpModule,
  ],
  exports: [
    WoodstockGamertagsComponent,
    SteelheadGamertagsComponent,
    SunriseGamertagsComponent,
    ApolloGamertagsComponent,
  ],
})
export class GamertagsModule {}
