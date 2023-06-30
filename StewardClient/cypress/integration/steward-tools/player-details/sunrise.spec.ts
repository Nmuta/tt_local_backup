import { login } from '@support/steward/auth/login';
import { disableFakeApi } from '@support/steward/util/disable-fake-api';
import { searchByGtag, searchByXuid } from '@support/steward/shared-functions/searching';
import { selectSunrise } from '@support/steward/shared-functions/game-nav';
import { stewardUrls } from '@support/steward/urls';
import { RetailUsers } from '@support/steward/common/account-info';
import {
  userDetailsFindBans,
  userDetailsFindProfileNotes,
  userDetailsFindRelatedConsoles,
  userDetailsFindRelatedGamertags,
  deepDiveFindCreditHistory,
  deepDiveFindOverviewData,
  inventoryFindPlayerInventoryData,
  notificationsFindNotification,
  userDetailsVerifyPlayerIdentityResults,
  userDetailsVerifyFlagData,
  testGtag,
  testXuid,
  ugcLiveriesFindLivery,
  auctionsFindCreatedAuction,
  jsonCheckJson,
} from './shared-tests';
import { tableHasEntry } from '@support/mat-form/table-has-entry';

const defaultSunriseUser = 'jordan';

context('Steward / Tools / Player Details / Sunrise', () => {
  beforeEach(() => {
    login();

    disableFakeApi();
  });

  context('GTAG Lookup', () => {
    beforeEach(() => {
      cy.visit(stewardUrls.tools.playerDetails.default);
      selectSunrise();
    });

    testUserDetails(defaultSunriseUser, testGtag);

    testDeepDive(defaultSunriseUser, testGtag);

    testInventory(defaultSunriseUser, testGtag);

    testNotifications(defaultSunriseUser, testGtag);

    testAuctions('madden', testGtag);

    testUgc('madden', testGtag);

    testJson(defaultSunriseUser, testGtag);
  });

  context('XUID Lookup', () => {
    beforeEach(() => {
      cy.visit(stewardUrls.tools.playerDetails.default);
      selectSunrise();
    });

    testUserDetails(defaultSunriseUser, testXuid);

    testDeepDive(defaultSunriseUser, testXuid);

    testInventory(defaultSunriseUser, testXuid);

    testNotifications(defaultSunriseUser, testXuid);

    testAuctions('madden', testXuid);

    testUgc('madden', testXuid);

    testJson(defaultSunriseUser, testXuid);
  });
});

function testUserDetails(userToSearch: string, isXuidTest: boolean): void {
  context('User Details', () => {
    // found user
    userDetailsVerifyPlayerIdentityResults(userToSearch, isXuidTest);

    // found flag data
    userDetailsVerifyFlagData(userToSearch, isXuidTest, 'Is Vip', true);

    // found bans
    userDetailsFindBans(userToSearch, isXuidTest);

    // found profile notes
    userDetailsFindProfileNotes(
      userToSearch,
      isXuidTest,
      'This is a testing string, not a chicken wing.',
    );

    // found related gamertags
    userDetailsFindRelatedGamertags(userToSearch, isXuidTest, '2535435129485725');

    // found related consoles
    userDetailsFindRelatedConsoles(userToSearch, isXuidTest, '18230637609444823812');
  });
}

function testDeepDive(userToSearch: string, isXuidTest: boolean): void {
  context('Deep Dive', () => {
    // found overview data
    deepDiveFindOverviewData(userToSearch, isXuidTest);

    // found credit history
    deepDiveFindCreditHistory(userToSearch, isXuidTest, 'UWP');
  });
}

function testInventory(userToSearch: string, isXuidTest: boolean): void {
  context('Inventory', () => {
    // found player inventory data
    inventoryFindPlayerInventoryData(userToSearch, isXuidTest);
  });
}

function testNotifications(userToSearch: string, isXuidTest: boolean): void {
  context('Notifications', () => {
    // found player inventory data
    notificationsFindNotification(userToSearch, isXuidTest);
  });
}

function testAuctions(userToSearch: string, isXuidTest: boolean): void {
  context('Auctions', () => {
    //Nobody has any auction history for this title :(
    //auctionsFindCreatedAuction(userToSearch, isXuidTest, 'sunrise', 'rsx', 'Acura RSX Type-S', 'Auction Info', 'Acura RSX Type S (2002)')
  });
}

function testUgc(userToSearch: string, isXuidTest: boolean): void {
  context('Ugc', () => {
    ugcLiveriesFindLivery(
      userToSearch,
      isXuidTest,
      'sunrise',
      'one-77',
      'Aston Martin One-77 (2010) [1181]',
      'metadata',
      'Aston Martin One-77',
    );
  });
}

function testJson(userToSearch: string, isXuidTest: boolean): void {
  context('JSON', () => {
    jsonCheckJson(userToSearch, isXuidTest);
  });
}
