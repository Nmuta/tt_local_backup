import { login } from '@support/steward/auth/login';
import { stewardUrls } from '@support/steward/urls';
import { disableFakeApi } from '@support/steward/util/disable-fake-api';

context('Steward / Tools', () => {
  beforeEach(async () => {
    await login();
    disableFakeApi();
  });

  context('Home', () => {
    beforeEach(() => {
      cy.visit(stewardUrls.tools.home);
    });

    it('should have cards for each tool', () => {
      cy.get('mat-card')
        .contains('mat-card-title', 'UGC')
        .parents('mat-card')
        .first()
        .should('exist')
        .contains('a', 'Open')
        .should('have.attr', 'href', stewardUrls.tools.ugc.default);

      cy.get('mat-card')
        .contains('mat-card-title', 'Player Details')
        .parents('mat-card')
        .first()
        .should('exist')
        .contains('a', 'Open')
        .should('have.attr', 'href', stewardUrls.tools.playerDetails.default);

      cy.get('mat-card')
        .contains('mat-card-title', 'Gifting')
        .parents('mat-card')
        .first()
        .should('exist')
        .contains('a', 'Open')
        .should('have.attr', 'href', stewardUrls.tools.gifting.default);

      cy.get('mat-card')
        .contains('mat-card-title', 'Banning')
        .parents('mat-card')
        .first()
        .should('exist')
        .contains('a', 'Open')
        .should('have.attr', 'href', stewardUrls.tools.banning.default);

      cy.get('mat-card')
        .contains('mat-card-title', 'Gift History')
        .parents('mat-card')
        .first()
        .should('exist')
        .contains('a', 'Open')
        .should('have.attr', 'href', stewardUrls.tools.giftHistory.default);

      cy.get('mat-card')
        .contains('mat-card-title', 'Kusto')
        .parents('mat-card')
        .first()
        .should('exist')
        .contains('a', 'Open')
        .should('have.attr', 'href', stewardUrls.tools.kusto);

      cy.get('mat-card')
        .contains('mat-card-title', 'Auction House Blocklist')
        .parents('mat-card')
        .first()
        .should('exist')
        .contains('a', 'Open')
        .should('have.attr', 'href', stewardUrls.tools.auctionBlocklist.default);

      cy.get('mat-card')
        .contains('mat-card-title', 'Messaging')
        .parents('mat-card')
        .first()
        .should('exist')
        .contains('a', 'Open')
        .should('have.attr', 'href', stewardUrls.tools.messaging.default);

      cy.get('mat-card')
        .contains('mat-card-title', 'Job History')
        .parents('mat-card')
        .first()
        .should('exist')
        .contains('a', 'Open')
        .should('have.attr', 'href', stewardUrls.tools.jobHistory);

      cy.get('mat-card')
        .contains('mat-card-title', 'Obligation')
        .parents('mat-card')
        .first()
        .should('exist')
        .contains('a', 'Open')
        .should('have.attr', 'href', stewardUrls.tools.obligation);

      cy.get('mat-card')
        .contains('mat-card-title', 'Salus')
        .parents('mat-card')
        .first()
        .should('exist')
        .contains('a', 'Open')
        .should('have.attr', 'href', stewardUrls.tools.salus);

      cy.get('mat-card')
        .contains('mat-card-title', 'Ban Review')
        .parents('mat-card')
        .first()
        .should('exist')
        .contains('a', 'Open')
        .should('have.attr', 'href', stewardUrls.tools.bulkBanHistory);
    });

    it('should have links to sidebar elements', () => {
      cy.get('a[mattooltip="Notifications"]').should('exist');
      cy.get('a[mattooltip="Settings"]').should('exist');
      cy.get('a[mattooltip="Profile"]').should('exist');
      cy.get('button[mattooltip="Contact Us"]').should('exist');
    });
  });
});
