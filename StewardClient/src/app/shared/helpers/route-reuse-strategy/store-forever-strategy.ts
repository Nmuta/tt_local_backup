import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from '@angular/router';
import { LogTopic } from '@services/logger';


/**
 * A route re-use strategy that stores the routed path for the session.
 * based on
 * - https://www.angulararchitects.io/aktuelles/sticky-routes-in-angular-2-3/
 * - https://itnext.io/cache-components-with-angular-routereusestrategy-3e4c8b174d5f
 */
export class StoreForeverStrategy implements RouteReuseStrategy {
  protected handles: { [key: string]: DetachedRouteHandle } = {};

  /** Route Reuse hook. */
  public shouldDetach(_route: ActivatedRouteSnapshot): boolean {
    const shouldDetach = true;
    console.log([LogTopic.RouteReuse], 'shouldDetach', _route, shouldDetach);
    return shouldDetach;
  }

  /** Route Reuse hook. */
  public store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    console.log([LogTopic.RouteReuse], 'store', route, handle);
    this.handles[route.routeConfig.path] = handle;
  }

  /** Route Reuse hook. */
  public shouldAttach(route: ActivatedRouteSnapshot): boolean {
    const shouldAttach = !!route.routeConfig && !!this.handles[route.routeConfig.path];
    console.log([LogTopic.RouteReuse], 'shouldAttach', route, shouldAttach);
    return shouldAttach;
  }

  /** Route Reuse hook. */
  public retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    const shouldRetrieve = !!route.routeConfig;
    const handle = this.handles[route.routeConfig.path];

    console.log([LogTopic.RouteReuse], 'retrieve', route, shouldRetrieve, handle);

    if (!shouldRetrieve) { return null };
    return handle;
  }

  /** Route Reuse hook. */
  public shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    const shouldReuseRoute = future.routeConfig === curr.routeConfig;
    console.log([LogTopic.RouteReuse], 'shouldReuseRoute', shouldReuseRoute, future, curr);
    return shouldReuseRoute;
  }
}