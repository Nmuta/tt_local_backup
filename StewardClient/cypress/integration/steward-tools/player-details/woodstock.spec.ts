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
  testGtag,
  testXuid,
  swapToTab,
  auctionsFindCreatedAuction,
  ugcLiveriesFindLivery,
  loyaltyFindTitlesPlayed,
  jsonCheckJson,
} from './shared-tests';

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

    testUserDetails(defaultWoodstockUser, testGtag);

    testDeepDive(defaultWoodstockUser, testGtag);

    testInventory(defaultWoodstockUser, testGtag);

    testNotifications(defaultWoodstockUser, testGtag);

    testAuctions('madden', testGtag);

    testUgc('madden', testGtag);

    testLoyalty('madden', testGtag, ['FH4', 'FH1', 'FH2', 'FH3', 'FM6', 'FM7', 'FM5']);

    testJson(defaultWoodstockUser, testGtag);
  });

  context('XUID Lookup', () => {
    beforeEach(() => {
      cy.visit(stewardUrls.tools.playerDetails.default);
      selectWoodstock();
    });

    testUserDetails(defaultWoodstockUser, testXuid);

    testDeepDive(defaultWoodstockUser, testXuid);

    testInventory(defaultWoodstockUser, testXuid);

    testNotifications(defaultWoodstockUser, testXuid);

    testAuctions('madden', testXuid);

    testUgc('madden', testXuid);

    testLoyalty('madden', testXuid, ['FH4', 'FH1', 'FH2', 'FH3', 'FM6', 'FM7', 'FM5']);

    testJson(defaultWoodstockUser, testXuid);
  });
});

function testUserDetails(userToSearch: string, isXuid: boolean): void {
  context('User Details', () => {
    // found user
    userDetailsVerifyPlayerIdentityResults(userToSearch, isXuid);

    // found flag data
    userDetailsVerifyFlagData(userToSearch, isXuid, 'Is Vip', true);

    // found bans
    userDetailsFindBans(userToSearch, isXuid);

    // found profile notes
    userDetailsFindProfileNotes(userToSearch, isXuid, 'test note from Steward API');

    // found related gamertags
    userDetailsFindRelatedGamertags(userToSearch, isXuid, '2535424453525895');

    // found related consoles
    userDetailsFindRelatedConsoles(userToSearch, isXuid, '18230640064596068933');
  });
}

function testDeepDive(userToSearch: string, isXuid: boolean): void {
  context('Deep Dive', () => {
    // found overview data
    deepDiveFindOverviewData(userToSearch, isXuid);

    // found credit history
    deepDiveFindCreditHistory(userToSearch, isXuid, 'Scorpio');
  });
}

function testInventory(userToSearch: string, isXuid: boolean): void {
  context('Inventory', () => {
    // found player inventory data
    inventoryFindPlayerInventoryData(userToSearch, isXuid);
  });
}

function testNotifications(userToSearch: string, isXuid: boolean): void {
  context('Notifications', () => {
    // found player inventory data
    notificationsFindNotification(userToSearch, isXuid);
  });
}

function testAuctions(userToSearch: string, isXuid: boolean): void {
  context('Auctions', () => {
    //The auction filter labels are currently using sunrise instead of woodstock, check in shared tests file for details
    auctionsFindCreatedAuction(
      userToSearch,
      isXuid,
      platformName,
      'rsx',
      'Acura RSX Type-S',
      'auctionInfo',
      'Acura RSX Type S (2002)',
    );
  });
}

function testUgc(userToSearch: string, isXuid: boolean): void {
  context('Ugc', () => {
    ugcLiveriesFindLivery(
      userToSearch,
      isXuid,
      platformName,
      '2jetz',
      'Hot Wheels 2JetZ (2018) [3405]',
      'metadata',
      'Hot Wheels 2JetZ (2018)',
    );
  });
}

function testLoyalty(userToSearch: string, isXuid: boolean, titles: string[]): void {
  context('Loyalty', () => {
    loyaltyFindTitlesPlayed(userToSearch, isXuid, platformName, titles);
  });
}

function testJson(userToSearch: string, isXuid: boolean): void {
  context('JSON', () => {
    jsonCheckJson(userToSearch, isXuid);
  });
}
