import { verifyPlayerIdentityResults } from '@support/steward/component/player-identity-results';

import { login } from '@support/steward/auth/login';
import { disableFakeApi } from '@support/steward/util/disable-fake-api';
import { searchByGtag, searchByXuid, selectOpus } from './page';
import { luke } from '@support/steward/common/account-info';

context('Steward / Tools / Player Details / Opus', () => {
  beforeEach(() => {
    login();

    disableFakeApi();
  });

  context('GTAG Lookup', () => {
    beforeEach(() => {
      searchByGtag(luke.gtag);
      selectOpus();
    });

    foundUserDataTest();
  });

  context('XUID Lookup', () => {
    beforeEach(() => {
      searchByXuid(luke.xuid);
      selectOpus();
    });

    foundUserDataTest();
  });
});

function foundUserDataTest(): void {
  it('should have found data', () => {
    verifyPlayerIdentityResults({ gtag: luke.gtag, xuid: luke.xuid, t10Id: false });

    //// switch to Inventory ////
    cy.contains('.mat-tab-label', 'Inventory').click();

    // found player inventory data
    cy.contains('mat-card', 'Player Inventory').within(() => {
      cy.contains('Credit Rewards');
    });
  });
}
