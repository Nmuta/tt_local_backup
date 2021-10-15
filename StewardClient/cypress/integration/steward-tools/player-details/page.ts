import { waitForProgressSpinners } from '@support/steward/common/wait-for-progress-spinners';
import { stewardUrls } from '@support/steward/urls';

/** Performs a search by gtag and waits for the search to complete. */
export function searchByGtag(gtag: string): void {
  cy.visit(stewardUrls.tools.playerDetails.default);
  cy.contains('button', 'GTAG').click();
  cy.contains('mat-form-field', 'Gamertag').click().type(`${gtag}\n`);
  waitForProgressSpinners();
}

/** Performs a search by xuid and waits for the search to complete. */
export function searchByXuid(xuid: string): void {
  cy.visit(stewardUrls.tools.playerDetails.default);
  cy.contains('button', 'XUID').click();
  cy.contains('mat-form-field', 'Xuid').click().type(`${xuid}\n`);
  waitForProgressSpinners();
}

/** Performs a search by t10id and waits for the search to complete. */
export function searchByT10Id(t10Id: string): void {
  cy.visit(stewardUrls.tools.playerDetails.default);
  cy.contains('button', 'T10').click();
  cy.contains('mat-form-field', 'T10 Id').click().type(`${t10Id}\n`);
  waitForProgressSpinners();
}

/** Switches to the Gravity title. */
export function selectGravity(): void {
  cy.contains('a', 'Gravity').click();
  waitForProgressSpinners();
}

/** Switches to the Apollo title. */
export function selectApollo(): void {
  cy.contains('a', 'Apollo').click();
  waitForProgressSpinners();
}
/** Switches to the Opus title. */
export function selectOpus(): void {
  cy.contains('a', 'Opus').click();
  waitForProgressSpinners();
}

/** Switches to the Sunrise title. */
export function selectSunrise(): void {
  cy.contains('a', 'Sunrise').click();
  waitForProgressSpinners();
}

/** Switches to the Woodstock title. */
export function selectWoodstock(): void {
  cy.contains('a', 'Woodstock').click();
  waitForProgressSpinners();
}

/** Switches to the Steelhead title. */
export function selectSteelhead(): void {
  cy.contains('a', 'Steelhead').click();
  waitForProgressSpinners();
}
