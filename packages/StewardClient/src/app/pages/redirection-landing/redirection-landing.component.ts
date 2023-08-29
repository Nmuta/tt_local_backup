import { Component } from '@angular/core';

/**
 * Angular 14 requires all routes have an attached component.
 * As such, we now have a landing-redirect component.
 */
@Component({
  selector: 'app-redirection-landing',
  templateUrl: './redirection-landing.component.html',
  styleUrls: ['./redirection-landing.component.scss'],
})
export class RedirectionLandingComponent {
  // TODO: Make this responsible for redirecting rather than `externalUrlRedirectResolver`
}
