import { resetToDefaultState } from '@support/page-utility/reset-to-default-state';
import { waitForProgressSpinners } from '@support/steward/common/wait-for-progress-spinners';
import { stewardUrls } from '@support/steward/urls';
import { withTags, Tag } from '@support/tags';

context('Steward / Support / Kusto', withTags(Tag.UnitTestStyle), () => {
  before(() => {
    resetToDefaultState();
    cy.visit(stewardUrls.tools.kusto);
  });

  it('should search for a Kusto Query and run it', withTags(Tag.Broken), () => {
    cy.get('mat-form-field')
      .contains('span', 'Search for a Kusto query')
      .parents('mat-form-field')
      .click();
    cy.get('mat-option').contains('span', 'Get Aegis Player Cheat List').click();
    cy.get('button').contains('span', 'Use Kusto Query').click();
    cy.get('button').contains('span', 'Run Query').parents('button').click();
    waitForProgressSpinners();
    cy.get('[aria-label="Download Kusto results"]').should('exist');
  });

  it('should type a Kusto Query and run it', () => {
    cy.get('button').contains('span', 'Clear Input').click();
    cy.get('mat-form-field').contains('span', 'Query').parents('mat-form-field')
      .type(`database('Live Ops Tools Prod').get_car_players(
      shortTitleName='fh5',
      carId = 1234,
      startDate = '2021-01-01',
      endDate = '2022-01-01',
      excludeBannedUsers = true,
      excludeBanDurationOver = 31
      )`);
    cy.get('button').contains('span', 'Run Query').parents('button').click();
    waitForProgressSpinners();
    cy.get('mat-row').contains('mat-cell', '2533274837999097').should('exist');
  });

  it('should fail to search for an invalid query', () => {
    cy.get('mat-form-field')
      .contains('span', 'Query')
      .parents('mat-form-field')
      .type('This is a query');
    cy.get('button').contains('span', 'Run Query').parents('button').click();
    waitForProgressSpinners();
    cy.contains('mat-panel-title', 'Failure occured.').should('exist');
  });
});
