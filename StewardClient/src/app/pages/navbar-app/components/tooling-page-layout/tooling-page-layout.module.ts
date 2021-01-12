import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { ToolingPageLayoutComponent } from './tooling-page-layout.component';

/** The feature module for the User Details route. */
@NgModule({
  declarations: [ToolingPageLayoutComponent],
  imports: [CommonModule, MatTabsModule],
  exports: [ToolingPageLayoutComponent],
})
export class ToolingPageLayoutModule {}
