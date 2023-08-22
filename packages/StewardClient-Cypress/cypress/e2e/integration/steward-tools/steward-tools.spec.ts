import { login } from '@support/steward/auth/login';
import { stewardUrls } from '@support/steward/urls';
import { disableFakeApi } from '@support/steward/util/disable-fake-api';

context('Steward / Tools', () => {
  before(() => {
    login();

    disableFakeApi();
  });

  context('Home', () => {
    before(() => {
      cy.visit(stewardUrls.tools.home);
    });

    it('should have cards for each tool', () => {
      // If we had a more consistent tools url type, we could maybe implement this as a loop?
      findMatCardWithLink('Gifting', stewardUrls.tools.gifting.default);
      findMatCardWithLink('UGC', stewardUrls.tools.search_ugc.default);
      findMatCardWithLink('Auction Blocklist', stewardUrls.tools.auctionBlocklist.default);
      findMatCardWithLink('Player Details', stewardUrls.tools.playerDetails.default);
      findMatCardWithLink('Banning', stewardUrls.tools.banning.default);
      findMatCardWithLink('Gift History', stewardUrls.tools.giftHistory.default);
      findMatCardWithLink('Kusto', stewardUrls.tools.kusto);
      findMatCardWithLink('Messaging', stewardUrls.tools.messaging.default);
      findMatCardWithLink('Obligation', stewardUrls.tools.obligation);
      findMatCardWithLink('Job History', stewardUrls.tools.jobHistory);
      findMatCardWithLink('Salus', stewardUrls.tools.salus);
      findMatCardWithLink('Ban Review', stewardUrls.tools.bulkBanHistory);
      findMatCardWithLink('Car Details', stewardUrls.tools.carDetails.default);
      findMatCardWithLink('Leaderboards', stewardUrls.tools.leaderboards.default);
      findMatCardWithLink('User Group Management', stewardUrls.tools.userGroupManagement.default);
      findMatCardWithLink('UGC Details', stewardUrls.tools.ugcDetails.default);
      findMatCardWithLink('Create Auction', stewardUrls.tools.createAuction.default);
      findMatCardWithLink('Message Of The Day', stewardUrls.tools.messageOfTheDay.default);
      findMatCardWithLink('Welcome Center Tiles', stewardUrls.tools.welcomeCenterTiles.default);
      findMatCardWithLink('Auction Details', stewardUrls.tools.auctionDetails.default);
      findMatCardWithLink(
        "Service's Table Storage",
        stewardUrls.tools.servicesTableStorage.default,
      );
      findMatCardWithLink('PlayFab', stewardUrls.tools.playfab.default);
      findMatCardWithLink('LSP Tasks', stewardUrls.tools.lspTasks.default);
      findMatCardWithLink('UGC Search', stewardUrls.tools.searchUgc.default);
      findMatCardWithLink('Meta Tools', stewardUrls.tools.metaTools.default);
      findMatCardWithLink('Permission Management', stewardUrls.tools.permissionManagement.default);
      findMatCardWithLink('Product Pricing', stewardUrls.tools.productPricing.default);
      findMatCardWithLink('Anti-Cheat Log Reader', stewardUrls.tools.acLogReader.default);
      findMatCardWithLink('Calendars', stewardUrls.tools.calendar.default);
    });

    it('should have links to sidebar elements', () => {
      cy.get('a[mattooltip="Notifications"]').should('exist');
      cy.get('a[mattooltip="Settings"]').should('exist');
      cy.get('a[mattooltip="Profile"]').should('exist');
      cy.get('a[mattooltip="Contact Us"]').should('exist');
    });
  });
});

function findMatCardWithLink(title: string, link: string): void {
  cy.get('mat-card')
    .contains('mat-card-title', title)
    .parents('mat-card')
    .first()
    .should('exist')
    .contains('a', 'Open')
    .should('have.attr', 'href', link);
}
