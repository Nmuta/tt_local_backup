import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { WindowService } from '@shared/services/window';
import { Observable } from 'rxjs';

/** Route guard that guarentees app routes are accessible in zendesk only. */
@Injectable({
  providedIn: 'root',
})
export class ZendeskGuardService implements CanActivate {
  constructor(
    private readonly router: Router,
    private readonly windowService: WindowService
  ) {}

  /** Logic to activate the route. */
  public canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    const inZendesk = !!this.windowService.zafClient();
    if (!inZendesk) {
      if (this.windowService.isInIframe) {
        // TODO: The fix for this is to reload the parent page, but we can't do anything about that from here.
        // For now, the navbar displays a warning and instruction to reload the page, which fixes the issue.
      } else {
        this.router.navigate(['/auth']);
      }
    }

    return inZendesk;
  }
}
