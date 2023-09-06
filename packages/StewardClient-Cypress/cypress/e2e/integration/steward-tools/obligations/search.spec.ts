import { inputHasValue } from '@support/mat-form/input-has-value';
import { login } from '@support/steward/auth/login';
import { stewardUrls } from '@support/steward/urls';
import { disableFakeApi } from '@support/steward/util/disable-fake-api';
import { clickTopLeftOfBody } from '@support/steward/util/click-top-left-of-body';
import { withTags, Tag } from '@support/tags';
import { waitForProgressSpinners } from '@support/steward/common/wait-for-progress-spinners';

const expectedObligationValues = {
  searchName : 'Franchise_Facts\n',
  name : 'Telemetry_FactPlayerUsageDaily',
  table : 'Telemetry_FactPlayerUsageDaily',
  database : 'T10Analytics',
  pipelineDependencies : '',
  query : 'get_telemetry_fact_player_usage_daily',
  startTime : '',
  endTime : '',
  maximumExecutionInterval : 'Maximum Execution Time',
  executionInterval : '1440',
  executionDelay : '4754',
  parallelism : '4'
}

context('Steward / Tools / Obligation / Search', withTags(Tag.Broken, Tag.UnitTestStyle), () => {
  before(() => {
    login();

    disableFakeApi();
    cy.visit(stewardUrls.tools.obligation);
  });

  it('should search', () => {
    // enter the search data
    const $obligationNameField = cy.get('#obligation-name');
    $obligationNameField.within(() => {
      cy.get('input').type(expectedObligationValues.searchName);
    });

    // do the get
    waitForProgressSpinners();
    cy.contains('button', 'sync').click().should('be.enabled');

    clickTopLeftOfBody();

    // verify we got the item
    const $firstActivity = cy
      .contains('mat-expansion-panel', expectedObligationValues.name)
      //.first();
    $firstActivity.should('exist');
    $firstActivity.find('.mat-expansion-indicator').click();
    waitForProgressSpinners();

    //inputHasValue('Name', expectedObligationValues.name);

    $firstActivity.within(() => {
      //inputHasValue('Name', expectedObligationValues.name);
      inputHasValue('Table', expectedObligationValues.table);
      inputHasValue('Database', expectedObligationValues.database);
      inputHasValue('Pipeline Dependencies', expectedObligationValues.pipelineDependencies);
      inputHasValue('Query', expectedObligationValues.query);
      //inputHasValue('Start Time', '22:54');
      //inputHasValue('End Time', '22:54');
      inputHasValue('Maximum Execution Time', expectedObligationValues.maximumExecutionInterval);
      inputHasValue('Execution Interval', expectedObligationValues.executionInterval);
      inputHasValue('Execution Delay', expectedObligationValues.executionDelay);
      inputHasValue('Parallelism', expectedObligationValues.parallelism);
    });

    cy.contains('button', 'sync').should('be.enabled');
    cy.contains('button', 'Update').should('be.enabled');
    cy.contains('button', 'Create').should('be.enabled');
    cy.contains('button', 'DELETE').should('be.disabled');
    cy.contains('button', 'POST').should('be.disabled');
  });
});
