import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataPrivacyNoticeComponent } from './data-privacy-notice.component';

/** Feature module for displaying Data Privacy Notice footer elements. */
@NgModule({
  declarations: [DataPrivacyNoticeComponent],
  imports: [CommonModule],
  exports: [DataPrivacyNoticeComponent],
})
export class DataPrivacyNoticeModule { }
