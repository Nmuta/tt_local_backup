import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { VerifyActionButtonModule } from '@components/verify-action-button/verify-action-button.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PipesModule } from '@shared/pipes/pipes.module';

import { BanHistoryComponent } from './ban-history/ban-history.component';
import { ConsolesComponent } from './consoles/consoles.component';
import { CreditHistoryComponent } from './credit-history/credit-history.component';
import { GamertagsComponent } from './gamertags/gamertags.component';
import { OverviewComponent } from './overview/overview.component';
import { SunriseComponent } from './sunrise.component';
import { UserFlagsComponent } from './user-flags/user-flags.component';

/** Module for Sunrise UI */
@NgModule({
  declarations: [
    SunriseComponent,
    UserFlagsComponent,
    OverviewComponent,
    BanHistoryComponent,
    GamertagsComponent,
    ConsolesComponent,
    CreditHistoryComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    PipesModule,
    ErrorSpinnerModule,
    VerifyActionButtonModule,
    MatChipsModule,
    MatTabsModule,
    MatTableModule,
    MatCardModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    FormsModule,
    FontAwesomeModule,
    MatButtonModule,
  ],
})
export class SunriseModule {}
