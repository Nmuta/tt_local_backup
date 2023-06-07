import { login } from '@support/steward/auth/login';
import { stewardUrls } from '@support/steward/urls';
import { disableFakeApi } from '@support/steward/util/disable-fake-api';
import { ben, chad, jordan, luke, madden } from '@support/steward/common/account-info';
import { waitForProgressSpinners } from '@support/steward/common/wait-for-progress-spinners';
import {
  addManyUsersByGTag,
  addManyUsersByXUID,
  addOneUserByGTag,
  addOneUserByXUID,
  allUsersDisabledTest,
  findLiveOpsDevGroupTest,
  invalidGamerTagTest,
  invalidXUIDTest,
  noVIPLoadTest,
  removeManyUsersByGTag,
  removeManyUsersByXUID,
  removeOneUserByGTag,
  removeOneUserByXUID,
  selectLspGroupUGM,
} from './shared-fucntions';

context('Steward / Tools / User Group Management / Woodstock', () => {
  beforeEach(() => {
    login();

    disableFakeApi();
    cy.visit(stewardUrls.tools.userGroupManagement.woodstock);
  });

  context('Basic Tests', () => {
    findLiveOpsDevGroupTest('Live Ops Developers', jordan);
    addOneUserByXUID('Live Ops Developers', luke);
    removeOneUserByXUID('Live Ops Developers', luke);
    addManyUsersByXUID('Live Ops Developers', luke, chad);
    removeManyUsersByXUID('Live Ops Developers', luke, chad);
    addOneUserByGTag('Live Ops Developers', luke);
    removeOneUserByGTag('Live Ops Developers', luke);
    addManyUsersByGTag('Live Ops Developers', luke, chad);
    removeManyUsersByGTag('Live Ops Developers', luke, chad);

    it('should remove all users (and put them back in)', () => {
      selectLspGroupUGM('Live Ops Developers');
      cy.get('[cyid="verifyDeleteAll"]').click();
      cy.contains('button', 'Delete All Users').click();
      waitForProgressSpinners();
      cy.contains('td', ben.xuid).should('not.exist');
      cy.contains('td', madden.xuid).should('not.exist');
      cy.contains('td', jordan.xuid).should('not.exist');

      //Add the users back to the group
      cy.contains('mat-form-field', 'Player XUIDs')
        .click()
        .type(ben.xuid + ', ' + madden.xuid + ', ' + jordan.xuid);
      //this is the checkbox next to the "Add Users" button
      cy.get('[cyid="verifyAdd"]').click();
      cy.contains('button', 'Add Users').click();
      waitForProgressSpinners();
      cy.contains('td', ben.xuid).should('exist');
      cy.contains('td', madden.xuid).should('exist');
      cy.contains('td', jordan.xuid).should('exist');
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
