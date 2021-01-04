import { Component } from '@angular/core';
import { faCog, faUser } from '@fortawesome/free-solid-svg-icons';

/** An overlay of buttons. */
@Component({
  selector: 'overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.scss']
})
export class OverlayComponent {
  public readonly profileIcon = faUser;
  public readonly settingsIcon = faCog;
}
