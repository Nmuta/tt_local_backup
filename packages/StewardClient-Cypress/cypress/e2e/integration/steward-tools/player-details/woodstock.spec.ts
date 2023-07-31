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
  auctionsFindCreatedAuction,
  ugcLiveriesFindLivery,
  loyaltyFindTitlesPlayed,
  jsonCheckJson,
  swapToTab,
} from './shared-tests';
import {
  contextSearchByGtagForPlayerDetails,
  contextSearchByXuidForPlayerDetails,
} from '@support/steward/shared-functions/searching';
import { resetToDefaultState } from '@support/page-utility/reset-to-default-state';

const defaultWoodstockUser = 'luke';
const platformName = 'woodstock';

context('Steward / Tools / Player Details / Woodstock', () => {
  before(() => {
    resetToDefaultState();
    cy.visit(stewardUrls.tools.playerDetails.default);
    selectWoodstock();
    contextSearchByGtagForPlayerDetails(RetailUsers.madden);
  });

  context('GTAG Lookup', () => {
    context('With default user', () => {
      testUserDetails(defaultWoodstockUser);
      testDeepDive();
      testInventory();
      testNotifications();
      testJson();
    });

    context('With Madden user', () => {
      testAuctions();
      testUgc();
      testLoyalty(['FH4', 'FH1', 'FH2', 'FH3', 'FM6', 'FM7', 'FM5']);
    });
  });

  context('XUID Lookup', () => {
    before(() => {
      cy.visit(stewardUrls.tools.playerDetails.default);
      selectWoodstock();
      contextSearchByXuidForPlayerDetails(RetailUsers[defaultWoodstockUser]);
    });

    context('With default user', () => {
      testUserDetails(defaultWoodstockUser);
      testDeepDive();
      testInventory();
      testNotifications();
      testJson();
    });

    context('With Madden user', () => {
      testAuctions();
      testUgc();
      testLoyalty(['FH4', 'FH1', 'FH2', 'FH3', 'FM6', 'FM7', 'FM5']);
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
    userDetailsFindProfileNotes('test note from Steward API');

    // found related gamertags
    userDetailsFindRelatedGamertags(RetailUsers[defaultWoodstockUser].relatedXuids['FH5']);

    // found related consoles
    userDetailsFindRelatedConsoles(RetailUsers[defaultWoodstockUser].relatedConsoles['FH5']);
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
    deepDiveFindCreditHistory('Scorpio');
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
    before(() => {
      swapToTab('Ugc');
    });

    ugcLiveriesFindLivery(platformName, 'Hot Wheels', '2JetZ', 'metadata');
  });
}

function testLoyalty(titles: string[]): void {
  context('Loyalty', () => {
    before(() => {
      swapToTab('Loyalty');
    });

    loyaltyFindTitlesPlayed(platformName, titles);
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
