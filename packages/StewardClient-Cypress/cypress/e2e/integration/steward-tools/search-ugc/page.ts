export function clickSearch(): void {
  cy.contains('button', 'Search').click();
}

export function selectUgcType(ugcType: string): void {
  cy.contains('mat-form-field', 'UGC Type').click();
  cy.get('.cdk-overlay-container').contains('mat-option', ugcType).click();
}

export function selectCar(carModel: string): void {
  cy.get('make-model-autocomplete').within(() => {
    cy.get('input').click({ force: true }).type(carModel, { force: true });
  });
  cy.get('.cdk-overlay-container').contains(carModel).click();
}

export function orderUgcBy(order: string): void {
  cy.contains('mat-form-field', 'Order By').click();
  cy.get('.cdk-overlay-container').contains('mat-option', order).click();
}

export function selectCuratedUgcType(curatedUgcType: string): void {
  cy.contains('mat-form-field', 'UGC Curated Type').click();
  cy.get('.cdk-overlay-container').contains('mat-option', curatedUgcType).click();
}
