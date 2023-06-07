import { waitForProgressSpinners } from '@support/steward/common/wait-for-progress-spinners';

/** Checks that the group used for testing exists */
export function findLiveOpsDevGroupTest(group, user): void {
  it('should find LiveOpsTestingGroup', () => {
    selectLspGroupUGM(group);
    waitForProgressSpinners();
    cy.contains('td', group).should('exist');
    cy.contains('td', user.xuid).should('exist');
  });
}

/** Checks that users can add one user to a group by XUID */
export function addOneUserByXUID(group, user): void {
  it('should add a user by XUID', () => {
    selectLspGroupUGM(group);
    cy.contains('mat-form-field', 'Player XUIDs').click().type(user.xuid);
    //this is the checkbox next to the "Add Users" button
    cy.get('[cyid="verifyAdd"]').click();
    cy.contains('button', 'Add Users').click();
    waitForProgressSpinners();
    cy.contains('td', user.xuid).should('exist');
  });
}

/** Checks that users can remove one user from a group by XUID */
export function removeOneUserByXUID(group, user): void {
  it('should remove a user by XUID', () => {
    selectLspGroupUGM(group);
    cy.contains('mat-form-field', 'Player XUIDs').click().type(user.xuid);
    //this is the checkbox next to the "Delete Users" button
    cy.get('[cyid="verifyDelete"]').click();
    cy.contains('button', 'Delete Users').click();
    waitForProgressSpinners();
    cy.contains('td', user.xuid).should('not.exist');
  });
}

/** Checks that users can add multiple users to a group by XUID */
export function addManyUsersByXUID(group, user1, user2): void {
  it('should add multiple users by XUID', () => {
    selectLspGroupUGM(group);
    cy.contains('mat-form-field', 'Player XUIDs')
      .click()
      .type(user1.xuid + ', ' + user2.xuid);
    //this is the checkbox next to the "Add Users" button
    cy.get('[cyid="verifyAdd"]').click();
    cy.contains('button', 'Add Users').click();
    waitForProgressSpinners();
    cy.contains('td', user1.xuid).should('exist');
    cy.contains('td', user2.xuid).should('exist');
  });
}

/** Checks that users can remove multiple users from a group by XUID */
export function removeManyUsersByXUID(group, user1, user2): void {
  it('should add multiple users by XUID', () => {
    selectLspGroupUGM(group);
    cy.contains('mat-form-field', 'Player XUIDs')
      .click()
      .type(user1.xuid + ', ' + user2.xuid);
    //this is the checkbox next to the "Add Users" button
    cy.get('[cyid="verifyDelete"]').click();
    cy.contains('button', 'Delete Users').click();
    waitForProgressSpinners();
    cy.contains('td', user1.xuid).should('not.exist');
    cy.contains('td', user2.xuid).should('not.exist');
  });
}

/** Checks that users can add one user to a group by Gamertag */
export function addOneUserByGTag(group, user): void {
  it('should add a user by Gamertag', () => {
    selectLspGroupUGM(group);
    cy.contains('button', 'GTAG').click();
    cy.contains('mat-form-field', 'Player Gamertags').click().type(user.gtag);
    //this is the checkbox next to the "Add Users" button
    cy.get('[cyid="verifyAdd"]').click();
    cy.contains('button', 'Add Users').click();
    waitForProgressSpinners();
    cy.contains('td', user.gtag).should('exist');
  });
}

/** Checks that users can remove one user from a group by Gamertag */
export function removeOneUserByGTag(group, user): void {
  it('should remove a user by Gamertag', () => {
    selectLspGroupUGM(group);
    cy.contains('button', 'GTAG').click();
    cy.contains('mat-form-field', 'Player Gamertags').click().type(user.gtag);
    //this is the checkbox next to the "Delete Users" button
    cy.get('[cyid="verifyDelete"]').click();
    cy.contains('button', 'Delete Users').click();
    waitForProgressSpinners();
    cy.contains('td', user.gtag).should('not.exist');
  });
}

/** Checks that users can add multiple users to a group by Gamertag */
export function addManyUsersByGTag(group, user1, user2): void {
  it('should add multiple users by Gamertag', () => {
    selectLspGroupUGM(group);
    cy.contains('button', 'GTAG').click();
    cy.contains('mat-form-field', 'Player Gamertags')
      .click()
      .type(user1.gtag + ', ' + user2.gtag);
    //this is the checkbox next to the "Add Users" button
    cy.get('[cyid="verifyAdd"]').click();
    cy.contains('button', 'Add Users').click();
    waitForProgressSpinners();
    cy.contains('td', user1.gtag).should('exist');
    cy.contains('td', user2.gtag).should('exist');
  });
}

/** Checks that users can remove multiple users from a group by Gamertag */
export function removeManyUsersByGTag(group, user1, user2): void {
  it('should add multiple users by Gamertag', () => {
    selectLspGroupUGM(group);
    cy.contains('button', 'GTAG').click();
    cy.contains('mat-form-field', 'Player Gamertags')
      .click()
      .type(user1.gtag + ', ' + user2.gtag);
    //this is the checkbox next to the "Add Users" button
    cy.get('[cyid="verifyDelete"]').click();
    cy.contains('button', 'Delete Users').click();
    waitForProgressSpinners();
    cy.contains('td', user1.gtag).should('not.exist');
    cy.contains('td', user2.gtag).should('not.exist');
  });
}

/** Checks that invalid XUIDs won't be added to a group */
export function invalidXUIDTest(group): void {
  it('should present an error on invalid XUID', () => {
    selectLspGroupUGM(group);
    cy.contains('mat-form-field', 'Player XUIDs').click().type('TotallyARealXUID');
    //this is the checkbox next to the "Add Users" button
    cy.get('[cyid="verifyAdd"]').click();
    cy.contains('button', 'Add Users').click();
    waitForProgressSpinners();
    cy.contains('mat-icon', 'warning').should('exist');
  });
};

/** Checks that ivalid Gamertags won't be added to a group */
export function invalidGamerTagTest(group): void {
  it('should present an error on invalid Gamertag', () => {
    selectLspGroupUGM(group);
    cy.contains('button', 'GTAG').click();
    cy.contains('mat-form-field', 'Player Gamertags').click().type('TotallyARealGTAG');
    //this is the checkbox next to the "Add Users" button
    cy.get('[cyid="verifyAdd"]').click();
    cy.contains('button', 'Add Users').click();
    waitForProgressSpinners();
    cy.contains('div', 'Failed to add').should('exist');
  });
}
 /** Checks that AllUsers group can't be managed */
export function allUsersDisabledTest(): void {
  it('should be disabled for AllUsers', () => {
    selectLspGroupUGM('AllUsers');
    cy.contains('mat-card', "Player management disabled for All User's Group").should('exist');
  });
};

/** Checks the VIP group can't be loaded */
export function noVIPLoadTest(): void {
  it('should not load VIP', () => {
    selectLspGroupUGM('VIP');
    cy.contains('span', 'This user group is too large to load users').should('exist');
  });
};

/** Selects an LSP group from the dropdown. */
export function selectLspGroupUGM(groupName: string): void {
  cy.contains('div', 'Select LSP Group').click();
  waitForProgressSpinners();
  cy.contains('mat-form-field', 'Select LSP Group').click().type(`${groupName}`);
  cy.contains('div', `${groupName}`).click('top');
}