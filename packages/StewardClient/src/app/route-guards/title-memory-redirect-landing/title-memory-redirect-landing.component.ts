import { Component } from '@angular/core';
import { TitleMemoryRedirectGuard } from '../title-memory-redirect.guard';

/** A landing page for pages which use {@link TitleMemoryRedirectGuard} to redirect the user to a specific sub-route. */
@Component({
  templateUrl: './title-memory-redirect-landing.component.html',
  styleUrls: ['./title-memory-redirect-landing.component.scss'],
})
export class TitleMemoryRedirectLandingComponent {
  // TODO: Make this responsible for redirecting rather than the route guard?
}
