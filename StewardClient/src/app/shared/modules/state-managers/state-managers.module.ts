import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonStateManagerDirective } from './button-state-manager.directive';
import { CheckboxStateManagerDirective } from './checkbox-state-manager.directive';

/** Directives that coordinate overriding of component properties where multiple attached directives might have opinions. */
@NgModule({
  declarations: [ButtonStateManagerDirective, CheckboxStateManagerDirective],
  imports: [CommonModule],
  exports: [ButtonStateManagerDirective, CheckboxStateManagerDirective],
})
export class StateManagersModule {}
