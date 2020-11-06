import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { ContentCollapseComponent } from './content-collapse.component';
export { ContentCollapseComponent } from './content-collapse.component';

/** Defines the ticket information item module. */
@NgModule({
  imports: [
    CommonModule,
    FontAwesomeModule,
    MatIconModule,
    MatButtonModule
  ],
  exports: [ContentCollapseComponent],
  declarations: [ContentCollapseComponent],
})
export class ContentCollapseModule {}
