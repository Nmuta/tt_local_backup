import { login } from '@support/steward/auth/login';
import { stewardUrls } from '@support/steward/urls';
import { disableFakeApi } from '@support/steward/util/disable-fake-api';
import { playerDetailsSunriseSharedTests } from './shared';

context('Steward / Support / Player Details / Sunrise', () => {
  beforeEach(() => {
    login();
    disableFakeApi();
  });

  context('XUID Lookup', () => {
    beforeEach(() => {
      cy.visit(stewardUrls.support.playerDetails.default);
      cy.contains('button', 'GTAG').click();
      cy.contains('mat-form-field', 'Gamertag').click().type('furikurifan5\n');
      cy.get('mat-progress-spinner', { timeout: 10_000 }).should('not.exist');
    });

    playerDetailsSunriseSharedTests();
  });
});
