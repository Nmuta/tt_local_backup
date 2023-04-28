import { inputHasValue } from '@support/mat-form/input-has-value';
import { login } from '@support/steward/auth/login';
import { stewardUrls } from '@support/steward/urls';
import { disableFakeApi } from '@support/steward/util/disable-fake-api';
import { clickTopLeftOfBody } from '@support/steward/util/click-top-left-of-body';

context('Steward / Tools / Obligation / Search', () => {
  beforeEach(() => {
    login();

    disableFakeApi();
    cy.visit(stewardUrls.tools.obligation);
  });

  it('should search', () => {
    // enter the search data
    const $obligationNameField = cy.get('#obligation-name');
    $obligationNameField.within(() => {
      cy.get('input').type('satbobba_test_pipeline\n');
    });

    // do the get
    cy.contains('button', 'sync').click().should('be.enabled');

    clickTopLeftOfBody();

    // verify we got the item
    const $firstActivity = cy
      .contains('mat-expansion-panel', 'Satbobba_Obligation_FactPlayerDaily_v2_PurchaseFields')
      .first();
    $firstActivity.should('exist');
    $firstActivity.click();

    $firstActivity.within(() => {
      inputHasValue('Name', 'Satbobba_Obligation_FactPlayerDaily_v2_PurchaseFields');
      inputHasValue('Table', 'Satbobba_Obligation_FactPlayerDaily_v2_PurchaseFields');
      inputHasValue('Database', 'T10Analytics');
      inputHasValue('Pipeline Dependencies', '');
      inputHasValue('Query', 'get_obligation_fact_player_daily_v2_satbobba');
      inputHasValue('Start Time', '22:54');
      inputHasValue('End Time', '22:54');
      inputHasValue('Maximum Execution Time', '1440');
      inputHasValue('Execution Interval', '1440');
      inputHasValue('Execution Delay', '30');
      inputHasValue('Parallelism', '2');
    });

    cy.contains('button', 'sync').should('be.enabled');
    cy.contains('button', 'Update').should('be.enabled');
    cy.contains('button', 'Create').should('be.enabled');
    cy.contains('button', 'DELETE').should('be.disabled');
    cy.contains('button', 'POST').should('be.disabled');
  });
});
