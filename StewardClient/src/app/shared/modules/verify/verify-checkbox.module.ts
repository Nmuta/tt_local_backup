import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerifyWithButtonDirective } from './verify-with.directive';

/** A feature module that allows a verification checkbox to be bound to other components. */
@NgModule({
  declarations: [VerifyWithButtonDirective],
  imports: [CommonModule],
  exports: [VerifyWithButtonDirective],
})
export class VerifyCheckboxModule {}
