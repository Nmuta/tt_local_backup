// this is a sample `login-credentials.ts` file
//
// the contents of `syncPath` can be retrieved by:
// 1. visit Steward in a comparable environment as a Live Ops Admin member
// 2. Navigate to any app
// 3. Open the Profile by clicking the person icon in the navbar
// 4. Under Dev Tools, click "Copy Sync Path"

import { StewardCredentials } from './steward-credentials';

export const credentials: StewardCredentials = {
  syncPath:
    '/auth/sync-state?accessToken=<REDACTED>&emailAddress=<REDACTED>&role=<REDACTED>&name=<REDACTED>&objectId=<REDACTED>',
};
