import { Injectable } from '@angular/core';
import { GameTitleCodeName, InitEndpointKeysError } from '@models/enums';
import { Action, State, StateContext, Selector, Store } from '@ngxs/store';
import { Observable, throwError } from 'rxjs';
import { InitEndpointKeys } from './endpoint-key-memory.actions';
import { catchError, tap } from 'rxjs/operators';
import { LspEndpoints } from '@models/lsp-endpoints';
import { clone } from 'lodash';
import { SettingsService } from '@services/settings/settings';

/**
 * Defines the endpoint key memory model.
 */
export class EndpointKeyMemoryModel {
  public [GameTitleCodeName.FM7]: string[];
  public [GameTitleCodeName.FH4]: string[];
  public [GameTitleCodeName.FH5]: string[];
  public [GameTitleCodeName.FM8]: string[];
}

/**
 *
 */
@Injectable()
@State<EndpointKeyMemoryModel>({
  name: 'endpointKeyMemory',
  defaults: {
    [GameTitleCodeName.FM7]: [],
    [GameTitleCodeName.FH4]: [],
    [GameTitleCodeName.FH5]: [],
    [GameTitleCodeName.FM8]: [],
  },
})
/** Defines the lsp group memoty state. */
export class EndpointKeyMemoryState {
  constructor(private readonly store: Store, private readonly settingsService: SettingsService) {}

  /** Updates the last gifting page title. */
  @Action(InitEndpointKeys, { cancelUncompleted: true })
  public initEndpointKeys$(ctx: StateContext<EndpointKeyMemoryModel>): Observable<LspEndpoints> {
    const endpoints$ = this.settingsService.getLspEndpoints$();

    return endpoints$.pipe(
      catchError(() => throwError(InitEndpointKeysError.LookupFailed)),
      tap(endpointKeys => {
        ctx.patchState({
          [GameTitleCodeName.FM7]: clone(endpointKeys.apollo.map(endpoint => endpoint.name)),
          [GameTitleCodeName.FH4]: clone(endpointKeys.sunrise.map(endpoint => endpoint.name)),
          [GameTitleCodeName.FH5]: clone(endpointKeys.woodstock.map(endpoint => endpoint.name)),
          [GameTitleCodeName.FM8]: clone(endpointKeys.steelhead.map(endpoint => endpoint.name)),
        });
      }),
    );
  }

  /** Woodstock endpoint key selector. */
  @Selector()
  public static woodstockEndpointKeys(state: EndpointKeyMemoryModel): string[] {
    return state.Woodstock;
  }

  /** Steelhead endpoint key selector. */
  @Selector()
  public static steelheadEndpointKeys(state: EndpointKeyMemoryModel): string[] {
    return state.Steelhead;
  }

  /** Sunrise endpoint key selector. */
  @Selector()
  public static sunriseEndpointKeys(state: EndpointKeyMemoryModel): string[] {
    return state.Sunrise;
  }

  /** Apollo endpoint key selector. */
  @Selector()
  public static apolloEndpointKeys(state: EndpointKeyMemoryModel): string[] {
    return state.Apollo;
  }
}
