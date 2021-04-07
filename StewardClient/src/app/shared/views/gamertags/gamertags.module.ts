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

/** A domain module for displaying related gamertags. */
@NgModule({
  declarations: [SunriseGamertagsComponent, ApolloGamertagsComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatTableModule,
    FontAwesomeModule,
    RouterModule,
    PipesModule,
    ErrorSpinnerModule,
    JsonDumpModule,
  ],
  exports: [SunriseGamertagsComponent, ApolloGamertagsComponent],
})
export class GamertagsModule {}
