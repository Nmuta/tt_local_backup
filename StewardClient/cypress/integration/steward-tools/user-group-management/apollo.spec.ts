import { login } from '@support/steward/auth/login';
import { stewardUrls } from '@support/steward/urls';
import { disableFakeApi } from '@support/steward/util/disable-fake-api';
import { selectLspGroup } from './shared-fucntions';
import { ben, chad, jordan, luke, madden } from '@support/steward/common/account-info';
import { waitForProgressSpinners } from '@support/steward/common/wait-for-progress-spinners';

context('Steward / Tools / User Group Management / Woodstock', () => {
  beforeEach(() => {
    login();

    disableFakeApi();
    cy.visit(stewardUrls.tools.userGroupManagement.apollo);
  });

  context('Basic Tests', () => {
    it('should find Live Ops Developers', () => {
      selectLspGroup('Live Ops Developers');
      cy.contains('td', 'Live Ops Developers').should('exist');
      waitForProgressSpinners();
      cy.contains('td', jordan.xuid).should('exist');
    });

    it('should add a user by XUID', () => {
      selectLspGroup('Live Ops Developers');
      cy.contains('mat-form-field', 'Player XUIDs').click().type(ben.xuid);
      //this is the checkbox next to the "Add Users" button
      cy.get('[id="mat-checkbox-2"]').click();
      cy.contains('button', 'Add Users').click();
      waitForProgressSpinners();
      cy.contains('td', ben.xuid).should('exist');
    });

    it('should remove a user by XUID', () => {
      selectLspGroup('Live Ops Developers');
      cy.contains('mat-form-field', 'Player XUIDs').click().type(ben.xuid);
      //this is the checkbox next to the "Delete Users" button
      cy.get('[id="mat-checkbox-3"]').click();
      cy.contains('button', 'Delete Users').click();
      waitForProgressSpinners();
      cy.contains('td', ben.xuid).should('not.exist');
    });

    it('should add multiple users by XUID', () => {
      selectLspGroup('Live Ops Developers');
      cy.contains('mat-form-field', 'Player XUIDs')
        .click()
        .type(ben.xuid + ', ' + chad.xuid);
      //this is the checkbox next to the "Add Users" button
      cy.get('[id="mat-checkbox-2"]').click();
      cy.contains('button', 'Add Users').click();
      waitForProgressSpinners();
      cy.contains('td', ben.xuid).should('exist');
      cy.contains('td', chad.xuid).should('exist');
    });

    it('should remove multiple users by XUID', () => {
      selectLspGroup('Live Ops Developers');
      cy.contains('mat-form-field', 'Player XUIDs')
        .click()
        .type(ben.xuid + ', ' + chad.xuid);
      //this is the checkbox next to the "Delete Users" button
      cy.get('[id="mat-checkbox-3"]').click();
      cy.contains('button', 'Delete Users').click();
      waitForProgressSpinners();
      cy.contains('td', ben.xuid).should('not.exist');
      cy.contains('td', chad.xuid).should('not.exist');
    });

    it('should add a user by Gamertag', () => {
      selectLspGroup('Live Ops Developers');
      cy.contains('button', 'GTAG').click();
      cy.contains('mat-form-field', 'Player Gamertags').click().type(ben.gtag);
      //this is the checkbox next to the "Add Users" button
      cy.get('[id="mat-checkbox-2"]').click();
      cy.contains('button', 'Add Users').click();
      waitForProgressSpinners();
      cy.contains('td', ben.gtag).should('exist');
    });

    it('should remove a user by Gamertag', () => {
      selectLspGroup('Live Ops Developers');
      cy.contains('button', 'GTAG').click();
      cy.contains('mat-form-field', 'Player Gamertags').click().type(ben.gtag);
      //this is the checkbox next to the "Delete Users" button
      cy.get('[id="mat-checkbox-3"]').click();
      cy.contains('button', 'Delete Users').click();
      waitForProgressSpinners();
      cy.contains('td', ben.gtag).should('not.exist');
    });

    it('should add multiple users by Gamertag', () => {
      selectLspGroup('Live Ops Developers');
      cy.contains('button', 'GTAG').click();
      cy.contains('mat-form-field', 'Player Gamertags')
        .click()
        .type(ben.gtag + ', ' + chad.gtag);
      //this is the checkbox next to the "Add Users" button
      cy.get('[id="mat-checkbox-2"]').click();
      cy.contains('button', 'Add Users').click();
      waitForProgressSpinners();
      cy.contains('td', ben.gtag).should('exist');
      cy.contains('td', chad.gtag).should('exist');
    });

    it('should remove multiple users by Gamertag', () => {
      selectLspGroup('Live Ops Developers');
      cy.contains('button', 'GTAG').click();
      cy.contains('mat-form-field', 'Player Gamertags')
        .click()
        .type(ben.gtag + ', ' + chad.gtag);
      //this is the checkbox next to the "Delete Users" button
      cy.get('[id="mat-checkbox-3"]').click();
      cy.contains('button', 'Delete Users').click();
      waitForProgressSpinners();
      cy.contains('td', ben.gtag).should('not.exist');
      cy.contains('td', chad.gtag).should('not.exist');
    });

    it('should remove all users (and put them back in)', () => {
      selectLspGroup('Live Ops Developers');
      waitForProgressSpinners();
      cy.get('[id="mat-checkbox-1"]').click();
      cy.contains('button', 'Delete All Users').click();
      waitForProgressSpinners();
      cy.contains('td', jordan.xuid).should('not.exist');
      cy.contains('td', madden.xuid).should('not.exist');
      cy.contains('td', luke.xuid).should('not.exist');

      //Add the users back to the group
      cy.contains('mat-form-field', 'Player XUIDs')
        .click()
        .type(jordan.xuid + ', ' + madden.xuid + ', ' + luke.xuid);
      //this is the checkbox next to the "Add Users" button
      cy.get('[id="mat-checkbox-2"]').click();
      cy.contains('button', 'Add Users').click();
      waitForProgressSpinners();
      cy.contains('td', jordan.xuid).should('exist');
      cy.contains('td', madden.xuid).should('exist');
      cy.contains('td', luke.xuid).should('exist');
    });
  });

  context('Invalid Input Checks', () => {
    it('should present an error on invalid XUID', () => {
      selectLspGroup('Live Ops Developers');
      cy.contains('mat-form-field', 'Player XUIDs').click().type('TotallyARealXUID');
      //this is the checkbox next to the "Add Users" button
      cy.get('[id="mat-checkbox-2"]').click();
      cy.contains('button', 'Add Users').click();
      waitForProgressSpinners();
      cy.contains('mat-icon', 'warning').should('exist');
    });

    it('should present an error on invalid Gamertag', () => {
      selectLspGroup('Live Ops Developers');
      cy.contains('button', 'GTAG').click();
      cy.contains('mat-form-field', 'Player Gamertags').click().type('TotallyARealGTAG');
      //this is the checkbox next to the "Add Users" button
      cy.get('[id="mat-checkbox-2"]').click();
      cy.contains('button', 'Add Users').click();
      waitForProgressSpinners();
      cy.contains('div', 'Failed to add').should('exist');
    });
  });

  context('Edge cases', () => {
    it('should be disabled for AllUsers', () => {
      selectLspGroup('AllUsers');
      cy.contains('mat-card', "Player management disabled for All User's Group").should('exist');
    });

    it('should not load VIP', () => {
      selectLspGroup('VIP');
      cy.contains('span', 'This user group is too large to load users').should('exist');
    });
  });
});
