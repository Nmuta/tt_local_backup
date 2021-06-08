import { inputHasValue } from '@support/mat-form/input-has-value';
import { login } from '@support/steward/auth/login';
import { stewardUrls } from '@support/steward/urls';
import { disableFakeApi } from '@support/steward/util/disable-fake-api';

context('Steward Data Pipelines App', () => {
  beforeEach(() => {
    login();
    disableFakeApi();
  });

  context('Data Pipelines Home', () => {
    beforeEach(() => {
      cy.visit(stewardUrls.dataPipeline.home);
    });

    it('should be on the Data Pipeline App', () => {
      cy.contains('Steward Data Pipeline App').should('exist');
    });
  });

  context('Obligation tool', () => {
    beforeEach(() => {
      cy.visit(stewardUrls.dataPipeline.obligation);
    });

    it('should be on the Obligation tool', () => {
      cy.contains('Obligation').should('exist');
      cy.contains('Find, Modify, and Create').should('exist');
    });

    it('should have link to Harvester page', () => {
      cy.get('a')
        .contains('Monitor on 343 Harvester')
        .should(
          'have.attr',
          'href',
          'https://343harvester.azurewebsites.net/ops?tenant=turn10&slice_id=df95c675-b8f0-45b9-b07d-6a1bb14db23e',
        );
    });

    it('should start empty', () => {
      const $obligationNameField = cy.get('#obligation-name');
      $obligationNameField.get('label').contains('Name').should('exist');
      $obligationNameField.get('input').should('have.value', '');

      const $obligationDescriptionField = cy.get('#obligation-description');
      $obligationDescriptionField.get('label').contains('Description').should('exist');
      $obligationDescriptionField.get('input').should('have.value', '');

      const $firstActivity = cy.contains('mat-expansion-panel', 'unnamed activity').first();
      $firstActivity.should('exist');
      $firstActivity.click();
      $firstActivity.within(() => {
        inputHasValue('Name', '');
        inputHasValue('Table', '');
        inputHasValue('Database', 'T10Analytics');
        inputHasValue('Pipeline Dependencies', '');
        inputHasValue('Query', '');
        inputHasValue('Start Time', '00:00');
        inputHasValue('End Time', '00:00');
        inputHasValue('Maximum Execution Time', '1440');
        inputHasValue('Execution Interval', '1440');
        inputHasValue('Execution Delay', '2880');
        inputHasValue('Parallelism', '2');
      });

      cy.contains('button', 'sync').should('be.disabled');
      cy.contains('button', 'Update').should('be.disabled');
      cy.contains('button', 'Create').should('be.disabled');
      cy.contains('button', 'DELETE').should('be.disabled');
      cy.contains('button', 'POST').should('be.disabled');
    });

    it('should search', () => {
      // enter the search data
      const $obligationNameField = cy.get('#obligation-name');
      $obligationNameField.within(() => {
        cy.get('input').type('satbobba_test_pipeline\n');
      });

      // do the get
      cy.contains('button', 'sync').click().should('be.enabled');

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
});
