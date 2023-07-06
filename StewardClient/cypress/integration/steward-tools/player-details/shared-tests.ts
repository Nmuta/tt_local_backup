import { checkboxHasValue } from '@support/mat-form/checkbox-has-value';
import { tableHasEntry } from '@support/mat-form/table-has-entry';
import { verifyPlayerIdentityResults } from '@support/steward/component/player-identity-results';
import { searchByGtag, searchByXuid } from '@support/steward/shared-functions/searching';
import { RetailUsers } from '@support/steward/common/account-info';

export const testGtag: boolean = false;
export const testXuid: boolean = true;

export function swapToTab(tabName: string): void {
  cy.contains('.mat-tab-label', tabName).click();
}

function searchUser(user: string, isXuid: boolean): void {
  if (isXuid == testXuid) {
    searchByXuid(RetailUsers[user].xuid);
  } else {
    searchByGtag(RetailUsers[user].gtag);
  }
}

/** Verifies that the user details match a searched user */
export function userDetailsVerifyPlayerIdentityResults(user: string, isXuid: boolean): void {
  it('should verify the player identity results', () => {
    searchUser(user, isXuid);
    swapToTab('User Details');
    verifyPlayerIdentityResults({
      gtag: RetailUsers[user].gtag,
      xuid: RetailUsers[user].xuid,
      t10Id: false,
    });
  });
}

/** Verifies that the flag data is correct for a searched user in the user details tab */
export function userDetailsVerifyFlagData(
  user: string,
  isXuid: boolean,
  flagName: string,
  flagValue: boolean,
): void {
  it('should find flag data', () => {
    searchUser(user, isXuid);
    swapToTab('User Details');
    checkboxHasValue(flagName, flagValue);
  });
}

/** Verifies that the searched user has ban details in the user details tab */
export function userDetailsFindBans(user: string, isXuid: boolean): void {
  it('should have ban history for a known user', () => {
    searchUser(user, isXuid);
    swapToTab('User Details');
    cy.contains('mat-card', 'Ban History')
      .within(() => {
        tableHasEntry('banDetails', 'All Requests');
      })
      .should('exist');
  });
}

/** Verifies that the searched user has a specified profile note in the user details tab */
export function userDetailsFindProfileNotes(user: string, isXuid: boolean, noteText: string): void {
  it('should have a profile note', () => {
    searchUser(user, isXuid);
    swapToTab('User Details');
    cy.contains('mat-card', 'Profile Notes').within(() => {
      tableHasEntry('text', noteText);
    });
  });
}

/** Verifies that the searched user has the correct related gamertags in the user details tab */
export function userDetailsFindRelatedGamertags(
  user: string,
  isXuid: boolean,
  relatedXuid: string,
): void {
  it('should have a related gtag', () => {
    searchUser(user, isXuid);
    swapToTab('User Details');
    cy.contains('mat-card', 'Related Gamertags').within(() => {
      tableHasEntry('xuid', relatedXuid);
    });
  });
}

/** Verifies that the user has the correct related consoles in the user details tab */
export function userDetailsFindRelatedConsoles(
  user: string,
  isXuid: boolean,
  expectedConsoleId: string,
): void {
  it('should have a related console ID', () => {
    searchUser(user, isXuid);
    swapToTab('User Details');
    cy.contains('mat-card', 'Consoles').within(() => {
      tableHasEntry('consoleId', expectedConsoleId);
    });
  });
}

/** Verifies that the user has current credits information in the overview of the deep dive tab */
export function deepDiveFindOverviewData(user: string, isXuid: boolean): void {
  it('should have an overview', () => {
    searchUser(user, isXuid);
    swapToTab('Deep Dive');
    cy.contains('th', 'Current Credits').should('exist');
  });
}

/** Verifies that the user has credit history in the deep dive tab */
export function deepDiveFindCreditHistory(user: string, isXuid: boolean, deviceType: string) {
  it('should have credit history', () => {
    searchUser(user, isXuid);
    swapToTab('Deep Dive');
    cy.contains('mat-card', 'Credit History').within(() => {
      tableHasEntry('deviceType', deviceType);
    });
  });
}

/** Verifies that the user has a credit reward in their inventory in the inventory tab */
export function inventoryFindPlayerInventoryData(user: string, isXuid: boolean): void {
  it('should have a credit reward in the inventory', () => {
    searchUser(user, isXuid);
    swapToTab('Inventory');
    cy.contains('mat-card', 'Player Inventory').within(() => {
      cy.contains('Credit Rewards');
    });
  });
}

/** Verifies that the user has a notification in the notifications tab */
export function notificationsFindNotification(user: string, isXuid: boolean): void {
  it('should have a notification', () => {
    searchUser(user, isXuid);
    swapToTab('Notifications');
    cy.contains('mat-card', 'Notifications')
      .within(() => {
        cy.contains('Notification');
      })
      .should('exist');
  });
}

/** Verifies that the user has a livery for a specified vehicle in the liveries tab */
export function ugcLiveriesFindLivery(
  user: string,
  isXuid: boolean,
  platform: string,
  carToSearch: string,
  carToClick: string,
  columnToLookAt: string,
  rowDataExpected: string,
): void {
  it('should have a searchable livery', () => {
    searchUser(user, isXuid);
    swapToTab('Ugc');
    cy.contains('.mat-tab-label', 'Liveries').click();
    cy.get(platform + '-make-model-autocomplete')
      .find('input')
      .click({ force: true })
      .type(carToSearch, { force: true });
    cy.contains(carToClick).click();
    cy.get(platform + '-ugc-table')
      .within(() => {
        tableHasEntry(columnToLookAt, rowDataExpected);
      })
      .should('exist');
  });
}

/** Verifies that the user has an auction for a specified vehicle in the auctions tab */
export function auctionsFindCreatedAuction(
  user: string,
  isXuid: boolean,
  platform: string,
  carToSearch: string,
  carToClick: string,
  columnToLookAt: string,
  rowDataExpected: string,
): void {
  it('should have a searchable created auction', () => {
    searchUser(user, isXuid);
    swapToTab('Auctions');
    cy.get(platform + '-player-auctions').within(() => {
      cy.contains('.mat-expansion-panel', 'Created Auctions').click();
      //somebody left this named as sunrise in woodstock
      //replace this once that's fixed
      cy.get('sunrise' + '-auction-filters').within(() => {
        cy.get('[formcontrolname="makeModelInput"]')
          .click({ force: true })
          .type(carToSearch, { force: true });
      });
    });
    cy.contains(carToClick).click();
    cy.get(platform + '-player-auctions').within(() => {
      cy.get('.mat-table')
        .within(() => {
          tableHasEntry(columnToLookAt, rowDataExpected);
        })
        .should('exist');
    });
  });
}

/** Verifies that the user has the correct titles in the loyalties tab */
export function loyaltyFindTitlesPlayed(
  user: string,
  isXuid: boolean,
  platform: string,
  titlesOwned: string[],
): void {
  it('should have the correct titles owned', () => {
    searchUser(user, isXuid);
    swapToTab('Loyalty');
    cy.get(platform + '-loyalty-rewards').within(() => {
      cy.get('.mat-table').within(() => {
        titlesOwned.forEach(title => {
          tableHasEntry(title, 'check_circle');
        });
      });
    });
  });
}

/** Verifies that the user has JSON search info in the JSON tab */
export function jsonCheckJson(user: string, isXuid: boolean): void {
  it('should have JSON for a user searched', () => {
    searchUser(user, isXuid);
    swapToTab('JSON');
    cy.contains('.mat-expansion-panel-header', 'Click to expand JSON').click();
    // here we could check the formatting of the JSON with some regex and/or jsonify some class to compare
  });
}
