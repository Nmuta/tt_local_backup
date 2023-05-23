import { waitForProgressSpinners } from '@support/steward/common/wait-for-progress-spinners';

const timeoutOverride = 60_000; /*ms*/

export function searchByGtag(gtag: string): void {
  cy.contains('button', 'GTAG').click();
  cy.contains('mat-form-field', 'Gamertag').click().type(`${gtag}\n`);
  waitForProgressSpinners(timeoutOverride);
}

export function searchByXuid(xuid: string): void {
  cy.contains('button', 'XUID').click();
  cy.contains('mat-form-field', 'XuID', { matchCase: false }).click().type(`${xuid}\n`);
  waitForProgressSpinners(timeoutOverride);
}

export function searchByT10Id(t10Id: string): void {
  cy.contains('button', 'T10').click();
  cy.contains('mat-form-field', 'T10 Id').click().type(`${t10Id}\n`);
  waitForProgressSpinners(timeoutOverride);
}

export function selectLspGroup(groupName: string): void {
  cy.contains('div', 'LSP Group Selection').click();
  waitForProgressSpinners();
  if (groupName == 'All Users') {
    cy.contains('mat-form-field', 'Select LSP Group').click().type('Live Ops Developers');
    cy.contains('div', 'Live Ops Developers').click();
  } else {
    cy.contains('mat-form-field', 'Select LSP Group').click().type(`${groupName}`);
    cy.contains('div', `${groupName}`).click();
  }
}
