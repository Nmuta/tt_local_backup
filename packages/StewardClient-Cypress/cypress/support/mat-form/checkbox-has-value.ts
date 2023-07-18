/** Asserts that a given mat-form-field (found by visible label name) has a given value. */
export function checkboxHasValue(label: string, expectedValue: boolean): void {
  const $formField = cy.contains('mat-checkbox', label);
  $formField.should('exist');
  $formField.within(() => {
    if (expectedValue) {
      $formField.get('input').should('be.checked');
    } else {
      $formField.get('input').should('not.be.checked');
    }
  });
}
