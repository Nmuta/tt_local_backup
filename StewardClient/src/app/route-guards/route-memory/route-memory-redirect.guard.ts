import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { firstFromParent } from '@helpers/first-from-parent';
import { Select } from '@ngxs/store';
import { RouteMemoryModel } from '@shared/state/route-memory/route-memory.model';
import { RouteMemoryState } from '@shared/state/route-memory/route-memory.state';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * One of a pair of route guards for /tool/ paths, which remember the last selected /tool/route/ and redirect to it.
 * This one should be applied to the default routes (like /tool/) and will recall the memory and redirect.
 * The default route should also redirect. See Gifting tool for a correct example.
 */
@Injectable({
  providedIn: 'root',
})
export class RouteMemoryRedirectGuard implements CanActivate {
  @Select(RouteMemoryState.model) private memoryState$: Observable<RouteMemoryModel>;

  constructor(private readonly router: Router) {}

  /** The guard hook. */
  public canActivate(
    route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot,
  ): Observable<UrlTree> {
    const toolName: keyof RouteMemoryModel = firstFromParent(
      route,
      r => r?.parent,
      r => r?.data?.tool,
    );

    return this.memoryState$.pipe(
      map(model => {
        const targetSubroute = model[toolName]?.toLowerCase();
        if (targetSubroute) {
          const basePath = route.pathFromRoot
            .map(r => r.url)
            .filter(f => !!f?.toString()?.trim())
            .join('/');
          return this.router.parseUrl(`${basePath}/${targetSubroute}`);
        }

        throw new Error(`no remembered route for ${route.url}`);
      }),
    );
  }
}
