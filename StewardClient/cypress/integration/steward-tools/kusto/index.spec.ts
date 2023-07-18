import { login } from '@support/steward/auth/login';
import { waitForProgressSpinners } from '@support/steward/common/wait-for-progress-spinners';
import { stewardUrls } from '@support/steward/urls';
import { disableFakeApi } from '@support/steward/util/disable-fake-api';

context('Steward / Support /Kusto', () => {
  beforeEach(() => {
    login();

    disableFakeApi();
    cy.visit(stewardUrls.tools.kusto);
  });

  it('should search for a Kusto Query and run it', () => {
    cy.get('mat-form-field')
      .contains('span', 'Search for a Kusto query')
      .parents('mat-form-field')
      .click();
    cy.get('mat-option').contains('span', 'Get Car Owners (W)').click();
    cy.get('button').contains('span', 'Use Kusto Query').click();
    cy.get('button').contains('span', 'Run Query').parents('button').click();
    waitForProgressSpinners();
    cy.get('mat-row').contains('mat-cell', '2533274837999097').should('exist');
  });

  it('should type a Kusto Query and run it', () => {
    cy.get('mat-form-field').contains('span', 'Query').parents('mat-form-field').click()
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

  it('should clear a query', () => {
    cy.get('mat-form-field')
      .contains('span', 'Search for a Kusto query')
      .parents('mat-form-field')
      .click();
    cy.get('mat-option').contains('span', 'Get Car Owners (W)').click();
    cy.get('button').contains('span', 'Use Kusto Query').click();
    cy.get('button').contains('span', 'Clear Input').click();
    cy.get('[disabled="true"]').contains('span', 'Run Query').should('exist');
  });

  it('should fail to search for an invalid query', () => {
    cy.get('mat-form-field')
      .contains('span', 'Query')
      .parents('mat-form-field')
      .click()
      .type('This is a query');
    cy.get('button').contains('span', 'Run Query').parents('button').click();
    waitForProgressSpinners();
    cy.contains('mat-panel-title', 'Failure occured.').should('exist');
  });
});
