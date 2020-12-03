import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SunriseGamertagsComponent } from './titles/sunrise/sunrise-gamertags.component';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PipesModule } from '@shared/pipes/pipes.module';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { MatTableModule } from '@angular/material/table';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterModule } from '@angular/router';

/** A domain module for displaying related gamertags. */
@NgModule({
  declarations: [SunriseGamertagsComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatTableModule,
    FontAwesomeModule,
    RouterModule,
    PipesModule,
    ErrorSpinnerModule,
  ],
  exports: [SunriseGamertagsComponent],
})
export class GamertagsModule {}
