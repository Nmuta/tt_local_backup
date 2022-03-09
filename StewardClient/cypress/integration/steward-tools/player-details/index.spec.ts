import env from '@support/env';
import { inputHasValue } from '@support/mat-form/input-has-value';
import { login } from '@support/steward/auth/login';
import { stewardUrls } from '@support/steward/urls';
import { disableFakeApi } from '@support/steward/util/disable-fake-api';

context('Steward / Tools / Player Details', () => {
  beforeEach(() => {
    login();

    disableFakeApi();
  });

  context('Default route', () => {
    beforeEach(() => {
      cy.visit(stewardUrls.tools.playerDetails.default);
    });

    it('should be on Sunrise', () => {
      cy.contains('a', 'FH4').should('have.class', 'mat-stroked-button');
    });

    it('gamertag should be empty', () => {
      inputHasValue('Gamertag', '');
    });

    it('should have correct links to other titles', () => {
      cy.contains('a', 'FH4').should('exist');
      cy.contains('a', 'FM7').should('exist');
      cy.contains('a', 'FH3').should('exist');
      cy.contains('a', 'Street').should('exist');
      cy.contains('a', 'FH5').should(env.testTitle.woodstock ? 'exist' : 'not.exist');
      cy.contains('a', 'Steelhead').should(env.testTitle.steelhead ? 'exist' : 'not.exist');
    });

    it('should have lookup type buttons', () => {
      cy.contains('button', 'GTAG').should('exist');
      cy.contains('button', 'XUID').should('exist');
      cy.contains('button', 'T10').should('exist');
    });
  });
});
