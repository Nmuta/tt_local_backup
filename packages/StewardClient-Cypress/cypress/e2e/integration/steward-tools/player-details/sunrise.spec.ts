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
  jsonCheckJson,
  swapToTab,
} from './shared-tests';
import {
  contextSearchByGtagForPlayerDetails,
  contextSearchByXuidForPlayerDetails,
} from '@support/steward/shared-functions/searching';
import { RetailUsers } from '@support/steward/common/account-info';
import { resetToDefaultState } from '@support/page-utility/reset-to-default-state';

const defaultSunriseUser = 'jordan';

context('Steward / Tools / Player Details / Sunrise', () => {
  before(() => {
    resetToDefaultState();
    cy.visit(stewardUrls.tools.playerDetails.default);
    selectSunrise();
  });

  context('GTAG Lookup', () => {
    context('With default user', () => {
      contextSearchByGtagForPlayerDetails(RetailUsers[defaultSunriseUser]);
      testUserDetails(defaultSunriseUser);
      testDeepDive();
      testInventory();
      testNotifications();
      testJson();
    });

    context('With Madden user', () => {
      contextSearchByGtagForPlayerDetails(RetailUsers.madden);
      testAuctions();
      testUgc();
    });
  });

  context('XUID Lookup', () => {
    before(() => {
      cy.visit(stewardUrls.tools.playerDetails.default);
      selectSunrise();
    });

    context('With default user', () => {
       contextSearchByXuidForPlayerDetails(RetailUsers[defaultSunriseUser]);
      testUserDetails(defaultSunriseUser);
      testDeepDive();
      testInventory();
      testNotifications();
      testJson();
    });

    context('With Madden user', () => {
      contextSearchByXuidForPlayerDetails(RetailUsers.madden);
      testAuctions();
      testUgc();
    });
  });
});

function testUserDetails(userToSearch: string): void {
  context('User Details', () => {
    before(() => {
      swapToTab('User Details');
    });
    
    // found user
    userDetailsVerifyPlayerIdentityResults(userToSearch);

    // found flag data
    userDetailsVerifyFlagData('Is Vip', true);

    // found bans
    userDetailsFindBans();

    // found profile notes
    userDetailsFindProfileNotes('This is a testing string, not a chicken wing.');

    // found related gamertags
    userDetailsFindRelatedGamertags(RetailUsers[defaultSunriseUser].relatedXuids['FH4']);

    // found related consoles
    userDetailsFindRelatedConsoles(RetailUsers[defaultSunriseUser].relatedConsoles['FH4']);
  });
}

function testDeepDive(): void {
  context('Deep Dive', () => {
    before(() => {
      swapToTab('Deep Dive');
    });
    // found overview data
    deepDiveFindOverviewData();

    // found credit history
    deepDiveFindCreditHistory('UWP');
  });
}

function testInventory(): void {
  context('Inventory', () => {
    before(() => {
      swapToTab('Inventory');
    });
    // found player inventory data
    inventoryFindPlayerInventoryData();
  });
}

function testNotifications(): void {
  context('Notifications', () => {
    before(() => {
      swapToTab('Notifications');
    });
    // found player inventory data
    notificationsFindNotification();
  });
}

function testAuctions(): void {
  context('Auctions', () => {
    before(() => {
      swapToTab('Auctions');
    });
    //TODO: Nobody has any auction history for this title 07/10
    //auctionsFindCreatedAuction(userToSearch, isXuidTest, 'sunrise', 'rsx', 'Acura RSX Type-S', 'Auction Info', 'Acura RSX Type S (2002)')
  });
}

function testUgc(): void {
  context('Ugc', () => {
    before(() => {
      swapToTab('Ugc');
    });
    ugcLiveriesFindLivery('sunrise', 'Aston Martin', 'One-77', 'metadata');
  });
}

function testJson(): void {
  context('JSON', () => {
    before(() => {
      swapToTab('JSON');
    });
    jsonCheckJson();
  });
}
