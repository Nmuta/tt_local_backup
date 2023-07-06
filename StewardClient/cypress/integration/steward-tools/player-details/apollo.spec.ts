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
  testGtag,
  testXuid,
  jsonCheckJson,
} from './shared-tests';

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

    testUserDetails(defaultApolloUser, testGtag);

    testInventory(defaultApolloUser, testGtag);

    testLiveries(defaultApolloUser, testGtag);

    testJson(defaultApolloUser, testGtag);
  });

  context('XUID Lookup', () => {
    beforeEach(() => {
      cy.visit(stewardUrls.tools.playerDetails.default);
      selectApollo();
    });

    testUserDetails(defaultApolloUser, testXuid);

    testInventory(defaultApolloUser, testXuid);

    testLiveries(defaultApolloUser, testXuid);

    testJson(defaultApolloUser, testXuid);
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

    // found related gamertags
    userDetailsFindRelatedGamertags(userToSearch, isXuidTest, '2535435129485725');

    // found related consoles
    userDetailsFindRelatedConsoles(userToSearch, isXuidTest, '18230637609444823812');
  });
}

function testInventory(userToSearch: string, isXuidTest: boolean): void {
  context('Inventory', () => {
    // found player inventory data
    inventoryFindPlayerInventoryData(userToSearch, isXuidTest);
  });
}

function testLiveries(userToSearch: string, isXuidTest: booleane): void {
  context('Liveries', () => {
    //TODO
  });
}

function testJson(userToSearch: string, isXuidTest: boolean): void {
  context('JSON', () => {
    jsonCheckJson(userToSearch, isXuidTest);
  });
}
