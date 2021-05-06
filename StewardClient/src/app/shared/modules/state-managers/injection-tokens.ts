import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

/** An implementation for a DISABLED_OVERRIDE provider. */
export interface DisableStateProvider {
  overrideDisable: boolean | undefined;
  overrideDisable$: Observable<boolean | undefined>;
}

export const STEWARD_DISABLE_STATE_PROVIDER = new InjectionToken<DisableStateProvider>(
  'STEWARD_DISABLE_STATE_PROVIDER',
);
