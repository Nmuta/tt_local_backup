import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonitorButtonDirective } from './monitor-button.directive';

/** A feature module that enables monitoring RXJS actions. */
@NgModule({
  declarations: [MonitorButtonDirective],
  imports: [CommonModule],
  exports: [MonitorButtonDirective],
})
export class MonitorActionModule {}
