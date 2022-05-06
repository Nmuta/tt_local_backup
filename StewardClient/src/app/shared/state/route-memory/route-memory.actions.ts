import { RouteMemoryModel } from './route-memory.model';

/** Updates the last visited route a given tool. */
export class UpdateRouteMemory {
  public static readonly type = '[RouteMemory] Update Last Route';
  constructor(public readonly tool: keyof RouteMemoryModel, public readonly routePath: string) {}
}
