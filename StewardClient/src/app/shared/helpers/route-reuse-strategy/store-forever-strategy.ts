import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from '@angular/router';
import { faker } from '@interceptors/fake-api/utility';
import { compact } from 'lodash';

interface RouteData {
  handle: DetachedRouteHandle;
  route: ActivatedRouteSnapshot;
}

/**
 * A route re-use strategy that stores the routed path for the session.
 * based on
 * - https://www.angulararchitects.io/aktuelles/sticky-routes-in-angular-2-3/
 * - https://itnext.io/cache-components-with-angular-routereusestrategy-3e4c8b174d5f
 */
export class StoreForeverStrategy implements RouteReuseStrategy {
  protected safeHandles = new Map<string, RouteData>();
  private readonly instanceId = faker.datatype.number();

  constructor() {
    // console.warn(`[RouteReuse|${this.instanceId}] constructor(${this.instanceId})`);
  }

  /** Route Reuse hook. */
  public shouldDetach(_route: ActivatedRouteSnapshot): boolean {
    const shouldDetach = true;
    // console.warn(`[RouteReuse|${this.instanceId}] shouldDetach(${shouldDetach}) | ${this.makeId(_route)}`);
    return shouldDetach;
  }

  /** Route Reuse hook. */
  public store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    const key = this.makeKey(route);
    const path = this.normalizePath(route);

    // Clear safe handles cache if Steward app is switched (i.e. base path updates /support, /community, etc... )
    if (path?.split('/')?.length <= 1) {
      this.safeHandles.clear();
    }

    if (handle !== null) {
      // console.warn(`[RouteReuse|${this.instanceId}] store() ${this.makeId(route)}`, handle);
      this.safeHandles.set(key, { handle, route });
    } else {
      // console.warn(`[RouteReuse|${this.instanceId}] store() ${this.makeId(route)}`, handle);
      this.safeHandles.delete(key);
    }
  }

  /** Route Reuse hook. */
  public shouldAttach(route: ActivatedRouteSnapshot): boolean {
    const key = this.makeKey(route);
    const shouldAttach = !!route.routeConfig && this.safeHandles.has(key);
    // console.warn(
    //   `[RouteReuse|${this.instanceId}] shouldAttach(${shouldAttach}) | ${this.makeId(route)}`,
    //   route,
    //   this.safeHandles.get(key),
    // );
    return shouldAttach;
  }

  /** Route Reuse hook. */
  public retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    const key = this.makeKey(route);
    const shouldRetrieve = !!route.routeConfig;
    const data = this.safeHandles.get(key);

    // console.warn(
    //   `[RouteReuse|${this.instanceId}] retrieve(${shouldRetrieve}) | ${this.makeId(route)}`,
    //   route,
    //   data,
    // );

    if (!shouldRetrieve || !data) {
      return null;
    }

    return data.handle;
  }

  /**
   * Route Reuse hook.
   * True if routing should not happen and we should remain on the same component.
   */
  public shouldReuseRoute(
    leaving: ActivatedRouteSnapshot,
    landing: ActivatedRouteSnapshot,
  ): boolean {
    const shouldReuseRoute = leaving.routeConfig === landing.routeConfig;
    // console.warn(`[RouteReuse|${this.instanceId}] shouldReuseRoute(${shouldReuseRoute}) | ${this.makeId(leaving)} -> ${this.makeId(landing)}`, leaving, landing);
    return shouldReuseRoute;
  }

  private makeKey(route: ActivatedRouteSnapshot): string {
    return `(${route.outlet})${this.getStoreKey(route)}`;
  }

  private makeId(route: ActivatedRouteSnapshot): string {
    return `(${route.outlet})${this.getStoreKey(route)}`;
  }

  private normalizePath(route: ActivatedRouteSnapshot) {
    const normalizedPath = route.pathFromRoot
      .map(r => r.url)
      .filter(v => !!v.toString().trim())
      .join('/');
    return normalizedPath;
  }

  // https://stackoverflow.com/questions/41584664/error-cannot-reattach-activatedroutesnapshot-created-from-a-different-route
  private takeFullUrl(route: ActivatedRouteSnapshot) {
    let next = route;
    // Since navigation is usually relative
    // we go down to find out the child to be shown.
    while (next.firstChild) {
      next = next.firstChild;
    }
    const segments = [];
    // Then build a unique key-path by going to the root.
    while (next) {
      segments.push(next.url.join('/'));
      next = next.parent;
    }

    const fullUrl = compact(segments.reverse()).join('/');
    return `${route.outlet}:${fullUrl}`;
  }

  // https://github.com/angular/angular/issues/13869
  private getStoreKey(route: ActivatedRouteSnapshot) {
    const baseUrl = this.getResolvedUrl(route);

    //this works, as ActivatedRouteSnapshot has only every one children ActivatedRouteSnapshot
    //as you can't have more since urls like `/project/1,2` where you'd want to display 1 and 2 project at the
    //same time
    const childrenParts = [];
    let deepestChild = route;
    while (deepestChild.firstChild) {
      deepestChild = deepestChild.firstChild;
      childrenParts.push(deepestChild.url.filter(v => !!v).join('/'));
    }

    //it's important to separate baseUrl with childrenParts so we don't have collisions.
    return `${baseUrl}||||${childrenParts.filter(v => !!v).join('/')}`;
  }

  private getResolvedUrl(route: ActivatedRouteSnapshot): string {
    return route?.pathFromRoot
      ?.map(v =>
        v.url
          ?.filter(v => !!v)
          ?.map(segment => segment?.toString())
          ?.filter(v => !!v)
          ?.join('/'),
      )
      ?.filter(v => !!v)
      ?.join('/');
  }

  private getConfiguredUrl(route: ActivatedRouteSnapshot): string {
    return (
      '/' +
      route.pathFromRoot
        .filter(v => v.routeConfig)
        .map(v => v.routeConfig.path)
        .join('/')
    );
  }
}
