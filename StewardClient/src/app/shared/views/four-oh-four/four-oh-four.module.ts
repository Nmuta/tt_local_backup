import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FourOhFourComponent } from './four-oh-four.component';
import { CenterContentsModule } from '@components/center-contents/center-contents.module';

/** Module containing a re-usable 404 page. */
@NgModule({
  declarations: [FourOhFourComponent],
  imports: [CommonModule, CenterContentsModule],
  exports: [FourOhFourComponent],
})
export class FourOhFourModule {}
