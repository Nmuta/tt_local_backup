import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FourOhFourComponent } from './four-oh-four.component';
import { CenterContentsModule } from '@components/center-contents/center-contents.module';

@NgModule({
  declarations: [FourOhFourComponent],
  imports: [CommonModule, CenterContentsModule],
  exports: [FourOhFourComponent],
})
export class FourOhFourModule {}
