import { waitForProgressSpinners } from '@support/steward/common/wait-for-progress-spinners';
import { stewardUrls } from '@support/steward/urls';

const timeoutOverride = 20_000; /*ms*/

/** Performs a search by gtag and waits for the search to complete. */
export function searchByGtag(gtag: string): void {
  cy.visit(stewardUrls.tools.playerDetails.default);
  cy.contains('button', 'GTAG').click();
  cy.contains('mat-form-field', 'Gamertag').click().type(`${gtag}\n`);
  waitForProgressSpinners(timeoutOverride);
}

/** Performs a search by xuid and waits for the search to complete. */
export function searchByXuid(xuid: string): void {
  cy.visit(stewardUrls.tools.playerDetails.default);
  cy.contains('button', 'XUID').click();
  cy.contains('mat-form-field', 'Xuid').click().type(`${xuid}\n`);
  waitForProgressSpinners(timeoutOverride);
}

/** Performs a search by t10id and waits for the search to complete. */
export function searchByT10Id(t10Id: string): void {
  cy.visit(stewardUrls.tools.playerDetails.default);
  cy.contains('button', 'T10').click();
  cy.contains('mat-form-field', 'T10 Id').click().type(`${t10Id}\n`);
  waitForProgressSpinners(timeoutOverride);
}

/** Switches to the Gravity title. */
export function selectGravity(): void {
  cy.contains('a', 'Street').click();
  waitForProgressSpinners(timeoutOverride);
}

/** Switches to the Apollo title. */
export function selectApollo(): void {
  cy.contains('a', 'FM7').click();
  waitForProgressSpinners(timeoutOverride);
}
/** Switches to the Opus title. */
export function selectOpus(): void {
  cy.contains('a', 'FH3').click();
  waitForProgressSpinners(timeoutOverride);
}

/** Switches to the Sunrise title. */
export function selectSunrise(): void {
  cy.contains('a', 'FH4').click();
  waitForProgressSpinners(timeoutOverride);
}

/** Switches to the Woodstock title. */
export function selectWoodstock(): void {
  cy.contains('a', 'FH5').click();
  waitForProgressSpinners(timeoutOverride);
}

/** Switches to the Steelhead title. */
export function selectSteelhead(): void {
  cy.contains('a', 'Steelhead').click();
  waitForProgressSpinners(timeoutOverride);
}
