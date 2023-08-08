/* Ensure that today's events populated */
export function calendarTodaysEventsExist(): void {
  cy.get('.cal-today').find('.mat-tooltip-trigger').should('exist');
  cy.get('.cal-today').should('have.class', 'cal-has-events');
}

/* Use all calendar date navigation buttons */
export function calendarTestBasicNavigation(): void {
  // Can go into more detail on this: testing Day, Week, and Month individually
  // However that's possibly outside the scope of Cypress testing, and there isn't too much to test for day and week
  cy.contains('button', 'Previous').click();
  cy.contains('button', 'Next').click();
  cy.contains('button', 'Today').click();
  cy.contains('button', 'Day').click();
  cy.contains('button', 'Week').click();
  cy.contains('button', 'Month').click();
}

/* Test the toggles on all filters, ending with all filters off. */
export function calendarTestFitlersEndstateOff(): void {
  cy.contains('button', 'Filter by Series and Playlist').click();
  cy.contains('button', 'Toggle All Off').click();
  cy.contains('button', 'Toggle All On').click();
  cy.get('mat-tree')
    .children()
    .each($el => {
      $el.find('mat-checkbox').click();
    });
  cy.contains('button', 'Filter by Series and Playlist').click({ force: true });
}

/* Click first event on today's list of events and ensure it contains the right information */
export function calendarTestEventDetails(expectedSeriesName): void {
  cy.get('.cal-today').find('.mat-tooltip-trigger').click({ force: true });
  cy.get('.cdk-overlay-container').should('contain', expectedSeriesName);
  cy.get('racers-cup-event-card').first().click();
  cy.contains('mat-icon', 'close').click({ force: true }).click({ force: true }); // Have to double click this, unsure why. Likely out of focus.
}
