import { login } from '@support/steward/auth/login';
import { stewardUrls } from '@support/steward/urls';
import { disableFakeApi } from '@support/steward/util/disable-fake-api';

context('Steward / Support', () => {
  beforeEach(() => {
    login();
    disableFakeApi();
  });

  context('Default route', () => {
    beforeEach(() => {
      cy.visit(stewardUrls.support.home);
    });

    it('should be on home page', () => {
      cy.contains('Steward Support App').should('exist');
    });

    it('should have links to all tools', () => {
      cy.contains('a', 'Player Details')
        .should('exist')
        .should('have.attr', 'href', stewardUrls.support.playerDetails.default);
      cy.contains('a', 'Gifting')
        .should('exist')
        .should('have.attr', 'href', stewardUrls.support.gifting.default);
      cy.contains('a', 'Banning')
        .should('exist')
        .should('have.attr', 'href', stewardUrls.support.banning.default);
      cy.contains('a', 'Gift History')
        .should('exist')
        .should('have.attr', 'href', stewardUrls.support.giftHistory.default);
      cy.contains('a', 'Kusto')
        .should('exist')
        .should('have.attr', 'href', stewardUrls.support.kusto);
      cy.contains('a', 'Messaging')
        .should('exist')
        .should('have.attr', 'href', stewardUrls.support.messaging.default);
    });

    it('should have links to sidebar elements', () => {
      cy.get('a mat-icon[svgicon="steward-notifications"]').should('exist');
      cy.get('a mat-icon[svgicon="steward-settings"]').should('exist');
      cy.get('a mat-icon[svgicon="steward-profile"]').should('exist');
    });
  });
});
