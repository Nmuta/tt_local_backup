import { verifyPlayerIdentityResults } from '@support/steward/component/player-identity-results';
import { login } from '@support/steward/auth/login';
import { disableFakeApi } from '@support/steward/util/disable-fake-api';
import { searchByGtag, searchByXuid } from '@support/steward/shared-functions/searching';
import { selectOpus } from '@support/steward/shared-functions/game-nav';
import { stewardUrls } from '@support/steward/urls';
import { chad } from '@support/steward/common/account-info';

context('Steward / Tools / Player Details / Opus', () => {
  beforeEach(() => {
    login();

    disableFakeApi();
  });

  context('GTAG Lookup', () => {
    beforeEach(() => {
      cy.visit(stewardUrls.tools.playerDetails.default);
      searchByGtag(chad.gtag);
      selectOpus();
    });

    foundUserDataTest();
  });

  context('XUID Lookup', () => {
    beforeEach(() => {
      cy.visit(stewardUrls.tools.playerDetails.default);
      searchByXuid(chad.xuid);
      selectOpus();
    });

    foundUserDataTest();
  });
});

function foundUserDataTest(): void {
  it('should have found data', () => {
    verifyPlayerIdentityResults({ gtag: chad.gtag, xuid: chad.xuid, t10Id: false });

    //// switch to Inventory ////
    cy.contains('.mat-tab-label', 'Inventory').click();

    // found player inventory data
    cy.contains('mat-card', 'Player Inventory').within(() => {
      cy.contains('Credit Rewards');
    });
  });
}
