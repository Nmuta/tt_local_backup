import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { ZendeskService } from '@services/zendesk';
import { WindowService } from '@shared/services/window';
import { Observable } from 'rxjs';

/** Route guard that guarentees app routes are accessible in zendesk only. */
@Injectable({
  providedIn: 'root',
})
export class ZendeskGuard implements CanActivate {
  constructor(private readonly router: Router, private readonly zendeskService: ZendeskService, private readonly windowService: WindowService) {}

  /** Logic to activate the route. */
  public canActivate(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot,
  ): Observable<boolean> | boolean {
    if (!this.zendeskService.inZendesk) {
      if (this.windowService.isInIframe) {
        // TODO: The fix for this is to reload the parent page, but we can't do anything about that from here.
        // For now, the navbar displays a warning and instruction to reload the page, which fixes the issue.
      }
    }

    return this.zendeskService.inZendesk;
  }
}
