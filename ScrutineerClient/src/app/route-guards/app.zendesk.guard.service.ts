import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { WindowService } from '@shared/services/window';
import { Observable } from 'rxjs';

/** ROute guard that guarentees app routes are accessible zendesk only */
@Injectable({
    providedIn: 'root',
})
export class ZendeskGuardService implements CanActivate {
    constructor(
        private router: Router,
        private windowService: WindowService
        ) {}

    /** Activate route logic */
    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        const inZendesk = !!this.windowService.zafClient();
        if (!inZendesk) {
            this.router.navigate(['/auth']);
        }

        return inZendesk;
    }
}
