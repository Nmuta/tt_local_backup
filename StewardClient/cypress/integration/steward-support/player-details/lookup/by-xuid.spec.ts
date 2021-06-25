import { login } from '@support/steward/auth/login';
import { stewardUrls } from '@support/steward/urls';
import { disableFakeApi } from '@support/steward/util/disable-fake-api';
import { displaysCorrectActiveTitles, jordansAccountInfo } from './shared';

context('Steward / Support / Player Details', () => {
  beforeEach(() => {
    login();
    disableFakeApi();
  });

  context('XUID Lookup', () => {
    beforeEach(() => {
      cy.visit(stewardUrls.support.playerDetails.default);
      cy.contains('button', 'XUID').click();
      cy.contains('mat-form-field', 'Xuid').click().type('2535435129485725\n');
      cy.get('mat-progress-spinner', { timeout: 10_000 }).should('not.exist');
    });

    displaysCorrectActiveTitles(jordansAccountInfo);
  });
});
