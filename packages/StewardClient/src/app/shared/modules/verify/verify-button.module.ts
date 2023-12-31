import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerifyButtonComponent } from './verify-button/verify-button.component';
import { HelpModule } from '../help/help.module';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { VerifyWithV2ButtonDirective } from './verify-with-v2.directive';
import { PermissionsModule } from '../permissions/permissions.module';
import { StateManagersModule } from '../state-managers/state-managers.module';

/** A feature module that allows a verification checkbox to be bound to other components. */
@NgModule({
  declarations: [VerifyWithV2ButtonDirective, VerifyButtonComponent],
  imports: [
    CommonModule,
    HelpModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    PermissionsModule,
    StateManagersModule,
  ],
  exports: [VerifyWithV2ButtonDirective, VerifyButtonComponent],
})
export class VerifyButtonModule {}
