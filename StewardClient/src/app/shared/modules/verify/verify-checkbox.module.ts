import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerifyWithButtonDirective } from './verify-with.directive';
import { VerifyHelpPopoverComponent } from './help-popover/verify-help-popover.component';
import { HelpModule } from '../help/help.module';
import { MatButtonModule } from '@angular/material/button';

/** A feature module that allows a verification checkbox to be bound to other components. */
@NgModule({
  declarations: [VerifyWithButtonDirective, VerifyHelpPopoverComponent],
  imports: [CommonModule, HelpModule, MatButtonModule],
  exports: [VerifyWithButtonDirective, VerifyHelpPopoverComponent],
})
export class VerifyCheckboxModule {}
