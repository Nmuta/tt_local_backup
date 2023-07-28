import { RetailUsers } from '@support/steward/common/account-info';
import { selectApollo } from '@support/steward/shared-functions/game-nav';
import { stewardUrls } from '@support/steward/urls';
import {
  userDetailsFindBans,
  userDetailsFindRelatedConsoles,
  userDetailsFindRelatedGamertags,
  inventoryFindPlayerInventoryData,
  userDetailsVerifyPlayerIdentityResults,
  userDetailsVerifyFlagData,
  jsonCheckJson,
} from './shared-tests';
import {
  contextSearchByGtagForPlayerDetails,
  contextSearchByXuidForPlayerDetails,
} from '@support/steward/shared-functions/searching';
import { resetToDefaultState } from '@support/page-utility/reset-to-default-state';

const defaultApolloUser = 'jordan';

context('Steward / Tools / Player Details / Apollo', () => {
  before(() => {
    resetToDefaultState();
    cy.visit(stewardUrls.tools.playerDetails.default);
    selectApollo();
  });

  context('GTAG Lookup', () => {
    context('With default user', () => {
      contextSearchByGtagForPlayerDetails(RetailUsers[defaultApolloUser]);

      testUserDetails(defaultApolloUser);
      testInventory();
      testLiveries();
      testJson();
    });
  });

  context('XUID Lookup', () => {
    before(() => {
      cy.visit(stewardUrls.tools.playerDetails.default);
      selectApollo();
    });

    context('With default user', () => {
      contextSearchByXuidForPlayerDetails(RetailUsers[defaultApolloUser]);

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
    userDetailsFindRelatedGamertags(RetailUsers[defaultApolloUser].relatedXuids['FM7']);

    // found related consoles
    userDetailsFindRelatedConsoles(RetailUsers[defaultApolloUser].relatedConsoles['FM7']);
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
