import { login } from '@support/steward/auth/login';
import { jordan } from '@support/steward/common/account-info';
import { verifyPlayerIdentityResults } from '@support/steward/component/player-identity-results';
import { disableFakeApi } from '@support/steward/util/disable-fake-api';
import { searchByGtag, searchByT10Id, searchByXuid, selectGravity } from './page';

context('Steward / Tools / Player Details / Gravity', () => {
  beforeEach(() => {
    login();
    disableFakeApi();
  });

  context('GTAG Lookup', () => {
    beforeEach(() => {
      searchByGtag(jordan.gtag);
      selectGravity();
    });

    foundUserData();
  });

  context('XUID Lookup', () => {
    beforeEach(() => {
      searchByXuid(jordan.xuid);
      selectGravity();
    });

    foundUserData();
  });

  context('T10ID Lookup', () => {
    beforeEach(() => {
      searchByT10Id(jordan.t10Id);
      selectGravity();
    });

    foundUserData();
  });
});

function foundUserData(): void {
  it('should have found data', () => {
    verifyPlayerIdentityResults({ gtag: jordan.gtag, xuid: jordan.xuid, t10Id: jordan.t10Id });

    //// switch to Inventory ////
    cy.contains('.mat-tab-label', 'Inventory').click();

    // found player inventory data
    cy.contains('mat-card', 'Player Inventory').within(() => {
      cy.contains('Credit Rewards');
    });
  });
}
