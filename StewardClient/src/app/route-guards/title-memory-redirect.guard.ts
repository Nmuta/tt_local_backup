import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, UrlSegment } from '@angular/router';
import { firstFromParent } from '@helpers/first-from-parent';
import { Select } from '@ngxs/store';
import { TitleMemoryModel } from '@shared/state/title-memory/title-memory.model';
import { TitleMemoryState } from '@shared/state/title-memory/title-memory.state';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


/**
 * One of a pair of route guards for /tool/ paths, which remember the last selected /tool/title/ and redirect to it.
 * This one should be applied to the default routes (like /tool/) and will recall the memory and redirect.
 * The default route should also redirect. See Gifting tool for a correct example.
 */
@Injectable({
  providedIn: 'root'
})
export class TitleMemoryRedirectGuard implements CanActivate {
  @Select(TitleMemoryState.model) private memoryState$: Observable<TitleMemoryModel>;

  constructor(private readonly router: Router) { }

  /** The guard hook. */
  public canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<UrlTree>
  {
    const toolName: keyof TitleMemoryModel = firstFromParent(route, r => r?.parent, r => r?.data?.tool);
    return this.memoryState$.pipe(map(model => {
      const targetSubroute = model[toolName]?.toLowerCase();
      if (targetSubroute) {
        return this.router.parseUrl(`${state.url}/${targetSubroute}`);
      } else {
        throw new Error(`no remembered route for ${route.url}`)
      }
    }));
  }
}
