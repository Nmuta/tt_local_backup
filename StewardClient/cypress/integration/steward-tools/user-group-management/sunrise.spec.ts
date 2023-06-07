import { login } from '@support/steward/auth/login';
import { stewardUrls } from '@support/steward/urls';
import { disableFakeApi } from '@support/steward/util/disable-fake-api';
import { chad, jordan, luke, madden } from '@support/steward/common/account-info';
import { waitForProgressSpinners } from '@support/steward/common/wait-for-progress-spinners';
import { addManyUsersByGTag, addManyUsersByXUID, addOneUserByGTag, addOneUserByXUID, allUsersDisabledTest, findLiveOpsDevGroupTest, invalidGamerTagTest, invalidXUIDTest, noVIPLoadTest, removeManyUsersByGTag, removeManyUsersByXUID, removeOneUserByGTag, removeOneUserByXUID, selectLspGroupUGM } from './shared-fucntions';

context('Steward / Tools / User Group Management / Woodstock', () => {
  beforeEach(() => {
    login();

    disableFakeApi();
    cy.visit(stewardUrls.tools.userGroupManagement.sunrise);
  });

  context('Basic Tests', () => {
    findLiveOpsDevGroupTest('Live Ops Developers', madden);
    addOneUserByXUID('Live Ops Developers', jordan);
    removeOneUserByXUID('Live Ops Developers', jordan);
    addManyUsersByXUID('Live Ops Developers', jordan, chad);
    removeManyUsersByXUID('Live Ops Developers', jordan, chad);
    addOneUserByGTag('Live Ops Developers', jordan);
    removeOneUserByGTag('Live Ops Developers', jordan);
    addManyUsersByGTag('Live Ops Developers', jordan, chad);
    removeManyUsersByGTag('Live Ops Developers', jordan, chad);

    it('should remove all users (and put them back in)', () => {
      selectLspGroupUGM('Live Ops Developers');
      cy.get('[cyid="verifyDeleteAll"]').click();
      cy.contains('button', 'Delete All Users').click();
      waitForProgressSpinners();
      cy.contains('td', madden.xuid).should('not.exist');
      cy.contains('td', luke.xuid).should('not.exist');

      //Add the users back to the group
      cy.contains('mat-form-field', 'Player XUIDs')
        .click()
        .type(madden.xuid + ', ' + luke.xuid);
      //this is the checkbox next to the "Add Users" button
      cy.get('[cyid="verifyAdd"]').click();
      cy.contains('button', 'Add Users').click();
      waitForProgressSpinners();
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
