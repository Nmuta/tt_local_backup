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
      cy.contains('a', 'Sunrise').should('have.class', 'mat-stroked-button');
    });

    it('gamertag should be empty', () => {
      inputHasValue('Gamertag', '');
    });

    it('should have correct links to other titles', () => {
      cy.contains('a', 'Sunrise').should('exist');
      cy.contains('a', 'Apollo').should('exist');
      cy.contains('a', 'Opus').should('exist');
      cy.contains('a', 'Gravity').should('exist');
      cy.contains('a', 'Woodstock').should(env.testTitle.woodstock ? 'exist' : 'not.exist');
      cy.contains('a', 'Steelhead').should(env.testTitle.steelhead ? 'exist' : 'not.exist');
    });

    it('should have lookup type buttons', () => {
      cy.contains('button', 'GTAG').should('exist');
      cy.contains('button', 'XUID').should('exist');
      cy.contains('button', 'T10').should('exist');
    });
  });
});
