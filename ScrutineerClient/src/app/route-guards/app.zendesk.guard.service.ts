import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { WindowService } from '@shared/services/window';

@Injectable({
    providedIn: 'root',
})
export class ZendeskGuardService implements CanActivate {
    constructor(
        private router: Router,
        private windowService: WindowService
        ) {}

    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        const inZendesk = !!this.windowService.zafClient();
        console.log(`guard: ${inZendesk}`);
        if (!inZendesk) {
            this.router.navigate(['/auth']);
        }

        return inZendesk;
    }
}
