import { login } from '@support/steward/auth/login';
import { disableFakeApi } from '@support/steward/util/disable-fake-api';
import { selectWoodstock } from '@support/steward/shared-functions/game-nav';
import { stewardUrls } from '@support/steward/urls';
import { RetailUsers } from '@support/steward/common/account-info';
import {
  userDetailsVerifyPlayerIdentityResults,
  userDetailsFindBans,
  userDetailsFindProfileNotes,
  userDetailsFindRelatedConsoles,
  userDetailsFindRelatedGamertags,
  deepDiveFindCreditHistory,
  deepDiveFindOverviewData,
  inventoryFindPlayerInventoryData,
  notificationsFindNotification,
  userDetailsVerifyFlagData,
  swapToTab,
  auctionsFindCreatedAuction,
  ugcLiveriesFindLivery,
  loyaltyFindTitlesPlayed,
  jsonCheckJson,
} from './shared-tests';
import { searchByGtag, searchByXuid } from '@support/steward/shared-functions/searching';

const defaultWoodstockUser = 'luke';
const platformName = 'woodstock';

context('Steward / Tools / Player Details / Woodstock', () => {
  beforeEach(() => {
    login();

    disableFakeApi();
  });

  context('GTAG Lookup', () => {
    beforeEach(() => {
      cy.visit(stewardUrls.tools.playerDetails.default);
      selectWoodstock();
    });

    context('With default user', () => {
      beforeEach(() => {
        searchByGtag(RetailUsers[defaultWoodstockUser].gtag);
      });
      testUserDetails(defaultWoodstockUser);

      testDeepDive();

      testInventory();

      testNotifications();

      testJson();
    });

    context('With Madden user', () => {
      beforeEach(() => {
        searchByGtag(RetailUsers['madden'].gtag);
      });
      testAuctions();

      testUgc();

      testLoyalty(['FH4', 'FH1', 'FH2', 'FH3', 'FM6', 'FM7', 'FM5']);
    });
  });

  context('XUID Lookup', () => {
    beforeEach(() => {
      cy.visit(stewardUrls.tools.playerDetails.default);
      selectWoodstock();
    });

    context('With default user', () => {
      beforeEach(() => {
        searchByXuid(RetailUsers[defaultWoodstockUser].xuid);
      });
      testUserDetails(defaultWoodstockUser);

      testDeepDive();

      testInventory();

      testNotifications();

      testJson();
    });

    context('With Madden user', () => {
      beforeEach(() => {
        searchByXuid(RetailUsers['madden'].xuid);
      });
      testAuctions();

      testUgc();

      testLoyalty(['FH4', 'FH1', 'FH2', 'FH3', 'FM6', 'FM7', 'FM5']);
    });
  });
});

function testUserDetails(userToSearch: string): void {
  context('User Details', () => {
    // found user
    userDetailsVerifyPlayerIdentityResults(userToSearch);

    // found flag data
    userDetailsVerifyFlagData('Is Vip', true);

    // found bans
    userDetailsFindBans();

    // found profile notes
    userDetailsFindProfileNotes('test note from Steward API');

    // found related gamertags
    userDetailsFindRelatedGamertags(RetailUsers[defaultWoodstockUser].relatedXuids['FH5']);

    // found related consoles
    userDetailsFindRelatedConsoles(RetailUsers[defaultWoodstockUser].relatedConsoles['FH5']);
  });
}

function testDeepDive(): void {
  context('Deep Dive', () => {
    // found overview data
    deepDiveFindOverviewData();

    // found credit history
    deepDiveFindCreditHistory('Scorpio');
  });
}

function testInventory(): void {
  context('Inventory', () => {
    // found player inventory data
    inventoryFindPlayerInventoryData();
  });
}

function testNotifications(): void {
  context('Notifications', () => {
    // found player inventory data
    notificationsFindNotification();
  });
}

function testAuctions(): void {
  context('Auctions', () => {
    //The auction filter labels are currently using sunrise instead of woodstock, check in shared tests file for details
    auctionsFindCreatedAuction(
      platformName,
      'rsx',
      'Acura RSX Type-S',
      'auctionInfo',
      'Acura RSX Type S (2002)',
    );
  });
}

function testUgc(): void {
  context('Ugc', () => {
    ugcLiveriesFindLivery(platformName, 'Hot Wheels', '2JetZ', 'metadata');
  });
}

function testLoyalty(titles: string[]): void {
  context('Loyalty', () => {
    loyaltyFindTitlesPlayed(platformName, titles);
  });
}

function testJson(): void {
  context('JSON', () => {
    jsonCheckJson();
  });
}
