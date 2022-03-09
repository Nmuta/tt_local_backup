import { waitForProgressSpinners } from '@support/steward/common/wait-for-progress-spinners';

/** Performs a search by gtag and waits for the search to complete. */
export function searchByGtag(gtag: string): void {
  cy.contains('button', 'GTAG').click();
  cy.contains('mat-form-field', 'Gamertag').click().type(`${gtag}\n`);
  waitForProgressSpinners();
}

/** Performs a search by xuid and waits for the search to complete. */
export function searchByXuid(xuid: string): void {
  cy.contains('button', 'XUID').click();
  cy.contains('mat-form-field', 'Xuid').click().type(`${xuid}\n`);
  waitForProgressSpinners();
}

/** Performs a search by t10id and waits for the search to complete. */
export function searchByT10Id(t10Id: string): void {
  cy.contains('button', 'T10').click();
  cy.contains('mat-form-field', 'T10 Id').click().type(`${t10Id}\n`);
  waitForProgressSpinners();
}

/** Selects an LSP group from the dropdown. */
export function selectLspGroup(groupName: string): void {
  cy.contains('div', 'LSP Group Selection').click();
  waitForProgressSpinners();
  cy.contains('mat-form-field', 'Select LSP Group').click().type(`${groupName}`);
  cy.contains('div', `${groupName}`).click();
}

/** Verifies a chip exists after player lookup. */
export function verifyChip(chipText: string): void {
  it('should have valid chip', () => {
    // found bans
    cy.contains('mat-chip', chipText, { matchCase: false });
  });
}

/** Switches to the Gravity title. */
export function selectGravity(): void {
  cy.contains('a', 'Street').click();
  waitForProgressSpinners();
}

/** Switches to the Apollo title. */
export function selectApollo(): void {
  cy.contains('a', 'FM7').click();
  waitForProgressSpinners();
}
/** Switches to the Opus title. */
export function selectOpus(): void {
  cy.contains('a', 'FH3').click();
  waitForProgressSpinners();
}

/** Switches to the Sunrise title. */
export function selectSunrise(): void {
  cy.contains('a', 'FH4').click();
  waitForProgressSpinners();
}

/** Switches to the Woodstock title. */
export function selectWoodstock(): void {
  cy.contains('a', 'FH5').click();
  waitForProgressSpinners();
}

/** Switches to the Steelhead title. */
export function selectSteelhead(): void {
  cy.contains('a', 'Steelhead').click();
  waitForProgressSpinners();
}
