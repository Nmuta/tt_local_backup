import { searchByGtag, searchByXuid } from '@support/steward/shared-functions/searching';
import { waitForProgressSpinners } from '@support/steward/common/wait-for-progress-spinners';
import { KnownUser } from '@support/steward/common/account-info';
import { clickTopLeftOfBody } from '@support/steward/util/click-top-left-of-body';

/** Searches for a user by Gtag and displays ban history */
export function testSearchForUserByGtag(user: KnownUser, page: string): void {
  it('should verify the player identity results', () => {
    searchByGtag(user.gtag);
    waitForProgressSpinners();
    cy.get('ban-chip-icon').should('exist');
    cy.get('ban-chip-icon').click();
    cy.get('mat-card-content').contains(page).should('exist');
  });
}

/** Fills out the form to create a ban, but does not initiate a ban fully */
export function testFillOutBan(): void {
  it('should fill out form for a ban', () => {
    cy.get('mat-form-field').contains('mat-label', 'Ban Reason').parents('mat-form-field').click();
    cy.get('mat-option').contains('span', 'Personal Attacks').parents('mat-option').click();
    cy.get('button').contains('mat-icon', 'lock_open').click();
    cy.get('button').contains('[disabled="true"]').should('not.exist');
    cy.get('button').contains('mat-icon', 'lock').click();
    cy.get('mat-form-field')
      .contains('mat-label', 'Ban Reason')
      .parents('mat-form-field')
      .click()
      .type('{selectall}{backspace}');
    clickTopLeftOfBody();
  });
}

/** Fills out the form to create a ban using custom reason, but does not initiate a ban fully */
export function testFillOutBanCustomReason(): void {
  it('should fill out form for a ban with a custom reason', () => {
    cy.get('mat-form-field')
      .contains('mat-label', 'Ban Reason')
      .parents('mat-form-field')
      .click()
      .type('I just really wanna ban someone');
    cy.get('button').contains('mat-icon', 'lock_open').click();
    cy.get('button').contains('[disabled="true"]').should('not.exist');
    cy.get('button').contains('mat-icon', 'lock').click();
    cy.get('mat-form-field')
      .contains('mat-label', 'Ban Reason')
      .parents('mat-form-field')
      .click()
      .type('{selectall}{backspace}');
    clickTopLeftOfBody();
  });
}

/** Ensures that bans cannot be entered without a reason */
export function testInvalidBanConditions(): void {
  it('should not allow a ban without a reason', () => {
    cy.get('button').contains('mat-icon', 'lock_open').click();
    cy.get('[disabled="true"]').should('exist');
  });
}

/** Searches for a user by Xuid and displays ban history */
export function testSearchForUserByXuid(user: KnownUser, page: string): void {
  it('should verify the player identity results', () => {
    searchByXuid(user.xuid);
    waitForProgressSpinners();
    cy.get('ban-chip-icon').should('exist');
    cy.get('ban-chip-icon').click();
    cy.get('mat-card-content').contains(page).should('exist');
  });
}

/** Ensures that user is cleared and bans are removed from the screen */
export function testClearAll(page: string): void {
  it('should clear user and repopulate accordingly', () => {
    cy.get('button').contains('span', 'Clear All').click();
    cy.get('mat-card')
      .contains('Ban History')
      .parents('mat-card')
      .contains('mat-card-content', page)
      .should('not.exist');
  });
}

/** Shows and hides the help card */
export function testHelpCard(): void {
  it('should show and hide Help Card', () => {
    cy.contains('mat-icon', 'help').click();
    cy.contains('mat-card-title', 'Verify Button').should('exist');
    cy.contains('span', 'Hide Verify Help Icon').click();
    cy.contains('mat-card-title', 'Verify Button').should('not.exist');
  });
}
