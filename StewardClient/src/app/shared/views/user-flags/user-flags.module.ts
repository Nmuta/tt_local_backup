import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SunriseUserFlagsComponent } from './titles/sunrise/sunrise-user-flags.component';
import { MatCardModule } from '@angular/material/card';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { VerifyActionButtonModule } from '@components/verify-action-button/verify-action-button.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PipesModule } from '@shared/pipes/pipes.module';

/** A domain module for displaying user flags. */
@NgModule({
  declarations: [SunriseUserFlagsComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    ErrorSpinnerModule,
    VerifyActionButtonModule,
    PipesModule,
    MatCheckboxModule,
    FormsModule,
  ],
  exports: [SunriseUserFlagsComponent],
})
export class UserFlagsModule {}
