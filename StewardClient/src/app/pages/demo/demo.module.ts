import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DemoComponent } from './demo.component';
import { DemoRouterModule } from './demo.routing';
import { MatCardModule } from '@angular/material/card';
import { CenterContentsModule } from '@components/center-contents/center-contents.module';

/** Demonstration and style testing pages. */
@NgModule({
  declarations: [DemoComponent],
  imports: [DemoRouterModule, CommonModule, MatCardModule, CenterContentsModule],
})
export class DemoModule {}
