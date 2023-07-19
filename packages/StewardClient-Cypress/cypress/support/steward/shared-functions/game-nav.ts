import { waitForProgressSpinners } from '@support/steward/common/wait-for-progress-spinners';

const timeoutOverride = 20_000; /*ms*/

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
  cy.contains('a', 'FM').click();
  waitForProgressSpinners(timeoutOverride);
}
