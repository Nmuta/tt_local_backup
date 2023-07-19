import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { firstFromParent } from '@helpers/first-from-parent';
import { GameTitleCodeName } from '@models/enums';
import { Store } from '@ngxs/store';
import { UpdateTitleMemory } from '@shared/state/title-memory/title-memory.actions';
import { TitleMemoryModel } from '@shared/state/title-memory/title-memory.model';
import { last } from 'lodash';

/**
 * One of a pair of route guards for /tool/ paths, which remember the last selected /tool/title/ and redirect to it.
 * This one should be applied to terminal routes (/tool/title/) and will set the memory.
 */
@Injectable({
  providedIn: 'root',
})
export class TitleMemorySetGuard implements CanActivate {
  constructor(private readonly store: Store) {}

  /** The guard hook. */
  public canActivate(route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): boolean {
    const toolName: keyof TitleMemoryModel = firstFromParent(
      route,
      r => r?.parent,
      r => r?.data?.tool,
    );
    const titleName: GameTitleCodeName = last(route.url).path as GameTitleCodeName;
    this.store.dispatch(new UpdateTitleMemory(toolName, titleName));

    return true;
  }
}
