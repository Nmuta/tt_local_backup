import { login } from '@support/steward/auth/login';
import { disableFakeApi } from '@support/steward/util/disable-fake-api';
import { selectSunrise } from '@support/steward/shared-functions/game-nav';
import { stewardUrls } from '@support/steward/urls';
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
  ugcLiveriesFindLivery,
  auctionsFindCreatedAuction,
  jsonCheckJson,
} from './shared-tests';
import { searchByGtag, searchByXuid } from '@support/steward/shared-functions/searching';
import { RetailUsers } from '@support/steward/common/account-info';

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

    context('With default user', () => {
      beforeEach(() => {
        searchByGtag(RetailUsers[defaultSunriseUser].gtag);
      });
      testUserDetails(defaultSunriseUser);

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
    });
  });

  context('XUID Lookup', () => {
    beforeEach(() => {
      cy.visit(stewardUrls.tools.playerDetails.default);
      selectSunrise();
    });

    context('With default user', () => {
      beforeEach(() => {
        searchByXuid(RetailUsers[defaultSunriseUser].xuid);
      });
      testUserDetails(defaultSunriseUser);

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
    userDetailsFindProfileNotes('This is a testing string, not a chicken wing.');

    // found related gamertags
    userDetailsFindRelatedGamertags('2535435129485725');

    // found related consoles
    userDetailsFindRelatedConsoles('18230637609444823812');
  });
}

function testDeepDive(): void {
  context('Deep Dive', () => {
    // found overview data
    deepDiveFindOverviewData();

    // found credit history
    deepDiveFindCreditHistory('UWP');
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
    //Nobody has any auction history for this title :(
    //auctionsFindCreatedAuction(userToSearch, isXuidTest, 'sunrise', 'rsx', 'Acura RSX Type-S', 'Auction Info', 'Acura RSX Type S (2002)')
  });
}

function testUgc(): void {
  context('Ugc', () => {
    ugcLiveriesFindLivery(
      'sunrise',
      'one-77',
      'Aston Martin One-77 (2010) [1181]',
      'metadata',
      'Aston Martin One-77',
    );
  });
}

function testJson(): void {
  context('JSON', () => {
    jsonCheckJson();
  });
}
