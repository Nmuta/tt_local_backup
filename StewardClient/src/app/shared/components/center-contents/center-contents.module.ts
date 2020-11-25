import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CenterContentsComponent } from './center-contents.component';

/** A feature module containing components for centering content. */
@NgModule({
  declarations: [CenterContentsComponent],
  imports: [CommonModule],
  exports: [CenterContentsComponent],
})
export class CenterContentsModule {}
