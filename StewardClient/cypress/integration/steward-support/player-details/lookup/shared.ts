import env from '@support/env';

/** The account info to verify. */
export interface AccountInfo {
  title: 'Woodstock' | 'Steelhead' | 'Gravity' | 'Sunrise' | 'Apollo' | 'Opus';
  hasAccount: boolean;
}

export const jordansAccountInfo: AccountInfo[] = [
  { title: 'Woodstock', hasAccount: false },
  { title: 'Steelhead', hasAccount: false },
  { title: 'Gravity', hasAccount: true },
  { title: 'Sunrise', hasAccount: true },
  { title: 'Apollo', hasAccount: true },
  { title: 'Opus', hasAccount: false },
];

/** Tests that verify that the correct accounts are displayed after a lookup. */
export function displaysCorrectActiveTitles(allExpected: AccountInfo[]): void {
  it('should display correct accounts', () => {
    for (const expected of allExpected) {
      // skip if our environment does not support this title yet
      if (!env.testTitle[expected.title.toLowerCase()]) {
        continue;
      }

      const $element = cy.contains('a', expected.title);
      if (expected.hasAccount) {
        // account should exist
        $element.should('not.have.class', 'mat-button-disabled');
      } else {
        // account should not exist
        $element.should('have.class', 'mat-button-disabled');
      }
    }
  });
}
