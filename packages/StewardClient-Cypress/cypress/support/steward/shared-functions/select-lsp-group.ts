import { waitForProgressSpinners } from '@support/steward/common/wait-for-progress-spinners';

/** Selects an LSP group from the dropdown. */
export function selectLspGroup(groupName: string): void {
  cy.contains('div', 'LSP Group Selection').click();
  waitForProgressSpinners();
  cy.contains('mat-form-field', 'Select LSP Group').click().type(`${groupName}`);
  cy.contains('div', `${groupName}`).click();
}
