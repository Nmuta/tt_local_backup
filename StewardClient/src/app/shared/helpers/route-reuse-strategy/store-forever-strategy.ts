import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from '@angular/router';
import { faker } from '@interceptors/fake-api/utility';

/**
 * A route re-use strategy that stores the routed path for the session.
 * based on
 * - https://www.angulararchitects.io/aktuelles/sticky-routes-in-angular-2-3/
 * - https://itnext.io/cache-components-with-angular-routereusestrategy-3e4c8b174d5f
 */
export class StoreForeverStrategy implements RouteReuseStrategy {
  protected safeHandles = new Map<string, DetachedRouteHandle>()
  private readonly instanceId = faker.random.number();

  constructor() {
    // console.log(`[RouteReuse|${this.instanceId}] constructor(${this.instanceId})`);
  }

  /** Route Reuse hook. */
  public shouldDetach(_route: ActivatedRouteSnapshot): boolean {
    const shouldDetach = true;
    // console.log(`[RouteReuse|${this.instanceId}] shouldDetach(${shouldDetach}) | ${this.makeId(_route)}`);
    return shouldDetach;
  }

  /** Route Reuse hook. */
  public store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    const key = this.makeKey(route);
    if (handle !== null) {
      // console.warn(`[RouteReuse|${this.instanceId}] store() ${this.makeId(route)}`, handle);
      this.safeHandles.set(key, handle);
    } else {
      // console.log(`[RouteReuse|${this.instanceId}] store() ${this.makeId(route)}`, handle);
      this.safeHandles.delete(key);
    }
  }

  /** Route Reuse hook. */
  public shouldAttach(route: ActivatedRouteSnapshot): boolean {
    const key = this.makeKey(route);
    const shouldAttach = !!route.routeConfig && this.safeHandles.has(key);
    // console.warn(`[RouteReuse|${this.instanceId}] shouldAttach(${shouldAttach}) | ${this.makeId(route)}`, route, this.safeHandles.get(key));
    return shouldAttach;
  }

  /** Route Reuse hook. */
  public retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    const key = this.makeKey(route);
    const shouldRetrieve = !!route.routeConfig;
    const handle = this.safeHandles.get(key);

    // console.warn(`[RouteReuse|${this.instanceId}] retrieve(${shouldRetrieve}) | ${this.makeId(route)}`, route, handle);

    if (!shouldRetrieve) {
      return null;
    }

    return handle;
  }

  /**
   * Route Reuse hook.
   * True if routing should not happen and we should remain on the same component.
   */
  public shouldReuseRoute(leaving: ActivatedRouteSnapshot, landing: ActivatedRouteSnapshot): boolean {
    const shouldReuseRoute = leaving.routeConfig === landing.routeConfig;
    // console.log(`[RouteReuse|${this.instanceId}] shouldReuseRoute(${shouldReuseRoute}) | ${this.makeId(leaving)} -> ${this.makeId(landing)}`, leaving, landing);
    return shouldReuseRoute;
  }

  private makeKey(route: ActivatedRouteSnapshot): string {
    const normalizedPath = route.pathFromRoot.map(r => r.url).filter(v => !!(v.toString().trim())).join('/');
    return `(${route.outlet})${normalizedPath}`;
  }

  private makeId(route: ActivatedRouteSnapshot): string {
    const normalizedPath = route.pathFromRoot.map(r => r.url).filter(v => !!(v.toString().trim())).join('/');
    return `${route.outlet}:${normalizedPath}`;
  }
}
