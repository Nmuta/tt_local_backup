import { getTestBed } from '@angular/core/testing';
import { UserRole } from '@models/enums';
import { UserModel } from '@models/user.model';
import { Store } from '@ngxs/store';
import { AppState } from '@shared/state/app-state';

/** Profile settings for LiveOpsAdmin. */
export const adminProfile: UserModel = {
  emailAddress: 'fake-email',
  name: 'fake-name',
  objectId: '9ed33253-9446-41eb-b9c9-99f69060da62',
  role: UserRole.LiveOpsAdmin,
}

/**
 * Sets the UserModel in Store without modifying anything else.
 * Defaults to Admin Profile.
 */
export function setUserProfile(profile: UserModel = adminProfile): void {
  const injector = getTestBed();
  const store = injector.inject(Store);
  const storeSnapshot = store.snapshot() as AppState;
  store.reset({
    ...storeSnapshot,
    user: {
      ...storeSnapshot.user,
      profile,
    }
  });
}