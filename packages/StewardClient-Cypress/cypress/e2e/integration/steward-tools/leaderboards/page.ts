import { waitForProgressSpinners } from '@support/steward/common/wait-for-progress-spinners';

/* Selects the specified leaderboard environment */
export function selectLeaderboardEnvironment(env: string): void {
  cy.contains('mat-form-field', 'Leaderboard Environment').click();
  cy.contains('mat-option', env).click();
  waitForProgressSpinners();
}

/* Types in the specified leaderboard name */
export function enterLeaderboardName(board: string): void {
  cy.contains('mat-form-field', 'Leaderboards').find('input').clear();
  cy.contains('mat-form-field', 'Leaderboards').contains('button', 'close').click();
  cy.contains('mat-form-field', 'Leaderboards').type(board);
  cy.contains('mat-option', board).click();
}

/* Toggles the specified filters */
export function clickFliters(filters: string[]): void {
  cy.get('body').click();
  cy.contains('mat-form-field', 'Leaderboard Filters').click();
  filters.forEach(filter => {
    cy.contains('mat-option', filter).click();
  });
  cy.get('body').click();
}

/* Toggles all filters in the specified groups */
export function clickAllFiltersInGroups(groups: string[]): void {
  cy.contains('mat-form-field', 'Leaderboard Filters').click();
  groups.forEach(group => {
    cy.contains('mat-optgroup', group).within(() => {
      cy.get('mat-option').click({ multiple: true });
    });
  });
  cy.get('body').click();
}

export function clickDeviceTypes(devices: string[]): void {
  cy.contains('mat-form-field', 'Device Type').click();
  devices.forEach(device => {
    cy.contains('mat-option', device).click();
  });
  cy.get('body').click();
}

export function pressSearch(): void {
  cy.contains('button', 'Search Leaderboard')
    .should('not.have.class', 'mat-button-disabled')
    .click();
  waitForProgressSpinners();
}

export function enterUserXuid(xuid: string): void {
  cy.contains('mat-form-field', 'Player XUID').type(xuid);
}
