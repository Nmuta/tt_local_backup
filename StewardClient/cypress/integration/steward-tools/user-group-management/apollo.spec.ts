import { login } from '@support/steward/auth/login';
import { stewardUrls } from '@support/steward/urls';
import { disableFakeApi } from '@support/steward/util/disable-fake-api';
import { ben, chad, jordan, luke, madden } from '@support/steward/common/account-info';
import { waitForProgressSpinners } from '@support/steward/common/wait-for-progress-spinners';
import { addManyUsersByGTag, addManyUsersByXUID, addOneUserByGTag, addOneUserByXUID, allUsersDisabledTest, findLiveOpsDevGroupTest, invalidGamerTagTest, invalidXUIDTest, noVIPLoadTest, removeManyUsersByGTag, removeManyUsersByXUID, removeOneUserByGTag, removeOneUserByXUID, selectLspGroupUGM } from './shared-fucntions';

context('Steward / Tools / User Group Management / Woodstock', () => {
  beforeEach(() => {
    login();

    disableFakeApi();
    cy.visit(stewardUrls.tools.userGroupManagement.apollo);
  });

  context('Basic Tests', () => {
    findLiveOpsDevGroupTest('Live Ops Developers', jordan);
    addOneUserByXUID('Live Ops Developers', ben);
    removeOneUserByXUID('Live Ops Developers', ben);
    addManyUsersByXUID('Live Ops Developers', ben, chad);
    removeManyUsersByXUID('Live Ops Developers', ben, chad);
    addOneUserByGTag('Live Ops Developers', ben);
    removeOneUserByGTag('Live Ops Developers', ben);
    addManyUsersByGTag('Live Ops Developers', ben, chad);
    removeManyUsersByGTag('Live Ops Developers', ben, chad);

    it('should remove all users (and put them back in)', () => {
      selectLspGroupUGM('Live Ops Developers');
      waitForProgressSpinners();
      cy.get('[cyid="verifyDeleteAll"]').click();
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
      cy.get('[cyid="verifyAdd"]').click();
      cy.contains('button', 'Add Users').click();
      waitForProgressSpinners();
      cy.contains('td', jordan.xuid).should('exist');
      cy.contains('td', madden.xuid).should('exist');
      cy.contains('td', luke.xuid).should('exist');
    });
  });

  context('Invalid Input Checks', () => {
    invalidXUIDTest('Live Ops Developers');

    invalidGamerTagTest('Live Ops Developers');
  });

  context('Edge cases', () => {
    allUsersDisabledTest();
    
    noVIPLoadTest();
  });
});
