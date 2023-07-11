import { login } from '@support/steward/auth/login';
import { RetailUsers } from '@support/steward/common/account-info';
import { disableFakeApi } from '@support/steward/util/disable-fake-api';
import { selectApollo } from '@support/steward/shared-functions/game-nav';
import { stewardUrls } from '@support/steward/urls';
import {
  userDetailsFindBans,
  userDetailsFindRelatedConsoles,
  userDetailsFindRelatedGamertags,
  inventoryFindPlayerInventoryData,
  swapToTab,
  userDetailsVerifyPlayerIdentityResults,
  userDetailsVerifyFlagData,
  jsonCheckJson,
} from './shared-tests';
import { searchByGtag, searchByXuid } from '@support/steward/shared-functions/searching';

const defaultApolloUser = 'jordan';

context('Steward / Tools / Player Details / Apollo', () => {
  beforeEach(() => {
    login();

    disableFakeApi();
  });

  context('GTAG Lookup', () => {
    beforeEach(() => {
      cy.visit(stewardUrls.tools.playerDetails.default);
      selectApollo();
    });

    context('With default user', () => {
      beforeEach(() => {
        searchByGtag(RetailUsers[defaultApolloUser].gtag);
      });

      testUserDetails(defaultApolloUser);

      testInventory();

      testLiveries();

      testJson();
    });
  });

  context('XUID Lookup', () => {
    beforeEach(() => {
      cy.visit(stewardUrls.tools.playerDetails.default);
      selectApollo();
    });

    context('With default user', () => {
      beforeEach(() => {
        searchByXuid(RetailUsers[defaultApolloUser].xuid);
      });

      testUserDetails(defaultApolloUser);

      testInventory();

      testLiveries();

      testJson();
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

    // found related gamertags
    userDetailsFindRelatedGamertags('2535435129485725');

    // found related consoles
    userDetailsFindRelatedConsoles('18230637609444823812');
  });
}

function testInventory(): void {
  context('Inventory', () => {
    // found player inventory data
    inventoryFindPlayerInventoryData();
  });
}

function testLiveries(): void {
  context('Liveries', () => {
    // TODO: Create liveries tests for Apollo
    // Currently, no test users have liveries in Apollo on the prod server
  });
}

function testJson(): void {
  context('JSON', () => {
    jsonCheckJson();
  });
}
