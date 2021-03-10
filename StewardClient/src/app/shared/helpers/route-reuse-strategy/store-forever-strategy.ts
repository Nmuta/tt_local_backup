import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from '@angular/router';
import { faker } from '@interceptors/fake-api/utility';

/**
 * A route re-use strategy that stores the routed path for the session.
 * based on
 * - https://www.angulararchitects.io/aktuelles/sticky-routes-in-angular-2-3/
 * - https://itnext.io/cache-components-with-angular-routereusestrategy-3e4c8b174d5f
 */
export class StoreForeverStrategy implements RouteReuseStrategy {
  protected handles: { [key: string]: DetachedRouteHandle } = {};
  private readonly instanceId = faker.random.number();

  constructor() {
    console.log(`[RouteReuse|${this.instanceId}] constructor(${this.instanceId})`);
  }

  /** Route Reuse hook. */
  public shouldDetach(_route: ActivatedRouteSnapshot): boolean {
    const shouldDetach = true;
    console.log(`[RouteReuse|${this.instanceId}] shouldDetach(${shouldDetach}) | ${this.makeKey(_route)}`);
    return shouldDetach;
  }

  /** Route Reuse hook. */
  public store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    const key = this.makeKey(route);
    console.log(`[RouteReuse|${this.instanceId}] store() ${key}`, handle);
    this.handles[key] = handle;
  }

  /** Route Reuse hook. */
  public shouldAttach(route: ActivatedRouteSnapshot): boolean {
    const key = this.makeKey(route);
    const handle = this.handles[key]
    const shouldAttach = !!route.routeConfig && !!handle;
    console.log(`[RouteReuse|${this.instanceId}] shouldAttach(${shouldAttach}) | ${key}`, route, handle);
    return shouldAttach;
  }

  /** Route Reuse hook. */
  public retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    const key = this.makeKey(route);
    const shouldRetrieve = !!route.routeConfig;
    const handle = this.handles[key];

    console.log(`[RouteReuse|${this.instanceId}] retrieve(${shouldRetrieve}) | ${key}`, route, handle);

    if (!shouldRetrieve) {
      return null;
    }

    return handle;
  }

  /**
   * Route Reuse hook.
   * @returns True if routing should not happen and we should remain on the same component.
   */
  public shouldReuseRoute(leaving: ActivatedRouteSnapshot, landing: ActivatedRouteSnapshot): boolean {
    const shouldReuseRoute = leaving.routeConfig === landing.routeConfig;
    console.log(`[RouteReuse|${this.instanceId}] shouldReuseRoute(${shouldReuseRoute}) | ${this.makeKey(leaving)} -> ${this.makeKey(landing)}`, leaving, landing);
    return shouldReuseRoute;
  }

  private makeKey(route: ActivatedRouteSnapshot): string {
    return route.pathFromRoot.map(r => r.url).filter(v => !!(v.toString().trim())).join('/');
  }
}
