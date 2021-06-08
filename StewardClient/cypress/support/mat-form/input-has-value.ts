/** Asserts that a given mat-form-field (found by visible label name) has a given value. */
export function inputHasValue(label: string, expectedValue: string): void {
  const $formField = cy.contains('mat-form-field', label);
  $formField.should('exist');
  $formField.within(() => {
    $formField.get('input').should('have.value', expectedValue);
  });
}
