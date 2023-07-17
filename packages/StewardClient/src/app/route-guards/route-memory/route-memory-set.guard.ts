import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { firstFromParent } from '@helpers/first-from-parent';
import { Store } from '@ngxs/store';
import { UpdateRouteMemory } from '@shared/state/route-memory/route-memory.actions';
import { RouteMemoryModel } from '@shared/state/route-memory/route-memory.model';
import { kebabCase } from 'lodash';

/**
 * One of a pair of route guards for /tool/ paths, which remember the last selected /tool/route/ and redirect to it.
 * This one should be applied to terminal routes (/tool/route/) and will set the memory.
 */
@Injectable({
  providedIn: 'root',
})
export class RouteMemorySetGuard implements CanActivate {
  constructor(private readonly store: Store) {}

  /** The guard hook. */
  public canActivate(route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): boolean {
    const toolName: keyof RouteMemoryModel = firstFromParent(
      route,
      r => r?.parent,
      r => r?.data?.tool,
    );
    const routeUrl = _state.url.split('/').filter(path => path.trim() !== '');
    const toolRouteIndex = routeUrl.findIndex(data => data === kebabCase(toolName));
    if (toolRouteIndex < 0) {
      return true;
    }

    routeUrl.splice(0, toolRouteIndex + 1);
    const routeToSave = routeUrl.join('/');
    this.store.dispatch(new UpdateRouteMemory(toolName, routeToSave));

    return true;
  }
}
