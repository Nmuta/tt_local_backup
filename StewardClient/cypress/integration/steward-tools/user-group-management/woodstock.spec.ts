import { login } from '@support/steward/auth/login';
import { stewardUrls } from '@support/steward/urls';
import { disableFakeApi } from '@support/steward/util/disable-fake-api';
import { selectLspGroup } from './shared-fucntions';
import { chad, luke } from '@support/steward/common/account-info';
import { waitForProgressSpinners } from '@support/steward/common/wait-for-progress-spinners';

context('Steward / Tools / User Group Management / Woodstock', () => {
  beforeEach(() => {
    login();

    disableFakeApi();
  });

  context('Basic Tests', () => {
    beforeEach(() => {
      cy.visit(stewardUrls.tools.userGroupManagement.woodstock);
    });

    it('should find Live Ops Developers', () => {
      selectLspGroup('Live Ops Developers');
      cy.contains('td', 'Live Ops Developers').should('exist');
      cy.contains('td', '2535435129485725').should('exist');
    });

    it('should add users by XUID', () => {
      selectLspGroup('Live Ops Developers');
      cy.contains('mat-form-field', 'Player XUIDs').click().type(luke.xuid);
      //this is the checkbox next to the "Add Users" button
      cy.get('[id="mat-checkbox-2"]').click();
      cy.contains('button', 'Add Users').click();
      waitForProgressSpinners();
      cy.contains('td', luke.xuid).should('exist');
    });

    it('should remove users by XUID', () => {
      selectLspGroup('Live Ops Developers');
      cy.contains('mat-form-field', 'Player XUIDs').click().type(luke.xuid);
      //this is the checkbox next to the "Delete Users" button
      cy.get('[id="mat-checkbox-3"]').click();
      cy.contains('button', 'Delete Users').click();
      waitForProgressSpinners();
      cy.contains('td', luke.xuid).should('not.exist');
    });

    it('should add multiple users by XUID', () => {
      selectLspGroup('Live Ops Developers');
      cy.contains('mat-form-field', 'Player XUIDs')
        .click()
        .type(luke.xuid + ', ' + chad.xuid);
      //this is the checkbox next to the "Add Users" button
      cy.get('[id="mat-checkbox-2"]').click();
      cy.contains('button', 'Add Users').click();
      waitForProgressSpinners();
      cy.contains('td', luke.xuid).should('exist');
      cy.contains('td', chad.xuid).should('exist');
    });

    it('should remove multiple users by XUID', () => {
      selectLspGroup('Live Ops Developers');
      cy.contains('mat-form-field', 'Player XUIDs')
        .click()
        .type(luke.xuid + ', ' + chad.xuid);
      //this is the checkbox next to the "Delete Users" button
      cy.get('[id="mat-checkbox-3"]').click();
      cy.contains('button', 'Delete Users').click();
      waitForProgressSpinners();
      cy.contains('td', luke.xuid).should('not.exist');
      cy.contains('td', chad.xuid).should('not.exist');
    });

    it('should add users by Gamertag', () => {
      selectLspGroup('Live Ops Developers');
      cy.contains('button', 'GTAG').click();
      cy.contains('mat-form-field', 'Player Gamertags').click().type(luke.gtag);
      //this is the checkbox next to the "Add Users" button
      cy.get('[id="mat-checkbox-2"]').click();
      cy.contains('button', 'Add Users').click();
      waitForProgressSpinners();
      cy.contains('td', luke.gtag).should('exist');
    });

    it('should remove users by Gamertag', () => {
      selectLspGroup('Live Ops Developers');
      cy.contains('button', 'GTAG').click();
      cy.contains('mat-form-field', 'Player Gamertags').click().type(luke.gtag);
      //this is the checkbox next to the "Delete Users" button
      cy.get('[id="mat-checkbox-3"]').click();
      cy.contains('button', 'Delete Users').click();
      waitForProgressSpinners();
      cy.contains('td', luke.gtag).should('not.exist');
    });

    it('should add multiple users by Gamertag', () => {
      selectLspGroup('Live Ops Developers');
      cy.contains('button', 'GTAG').click();
      cy.contains('mat-form-field', 'Player Gamertags')
        .click()
        .type(luke.gtag + ', ' + chad.gtag);
      //this is the checkbox next to the "Add Users" button
      cy.get('[id="mat-checkbox-2"]').click();
      cy.contains('button', 'Add Users').click();
      waitForProgressSpinners();
      cy.contains('td', luke.gtag).should('exist');
      cy.contains('td', chad.gtag).should('exist');
    });

    it('should remove multiple users by Gamertag', () => {
      selectLspGroup('Live Ops Developers');
      cy.contains('button', 'GTAG').click();
      cy.contains('mat-form-field', 'Player Gamertags')
        .click()
        .type(luke.gtag + ', ' + chad.gtag);
      //this is the checkbox next to the "Delete Users" button
      cy.get('[id="mat-checkbox-3"]').click();
      cy.contains('button', 'Delete Users').click();
      waitForProgressSpinners();
      cy.contains('td', luke.gtag).should('not.exist');
      cy.contains('td', chad.gtag).should('not.exist');
    });

    it('should remove all users (and put them back in)', () => {
      selectLspGroup('Live Ops Developers');
      cy.get('[id="mat-checkbox-1"]').click();
      cy.contains('button', 'Delete All Users').click();
      waitForProgressSpinners();
      cy.contains('td', '2533274833661814').should('not.exist');
      cy.contains('td', '2533274879135661').should('not.exist');
      cy.contains('td', '2535435129485725').should('not.exist');

      //Add the users back to the group
      cy.contains('mat-form-field', 'Player XUIDs')
        .click()
        .type('2533274833661814, 2533274879135661, 2535435129485725');
      //this is the checkbox next to the "Add Users" button
      cy.get('[id="mat-checkbox-2"]').click();
      cy.contains('button', 'Add Users').click();
      waitForProgressSpinners();
      cy.contains('td', '2533274833661814').should('exist');
      cy.contains('td', '2533274879135661').should('exist');
      cy.contains('td', '2535435129485725').should('exist');
    });
  });

  context('Invalid Input Checks', () => {
    beforeEach(() => {
      cy.visit(stewardUrls.tools.userGroupManagement.woodstock);
    });

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
    beforeEach(() => {
      cy.visit(stewardUrls.tools.userGroupManagement.woodstock);
    });

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
