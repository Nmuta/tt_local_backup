import { Component } from '@angular/core';
import { StandardCopyIconComponent } from '../standard-copy-icon/standard-copy-icon.component';

/** A standard utility for wrapping around copyable elements. */
@Component({
  selector: 'standard-copy',
  templateUrl: './standard-copy.component.html',
  styleUrls: ['./standard-copy.component.scss'],
})
export class StandardCopyComponent extends StandardCopyIconComponent {}
