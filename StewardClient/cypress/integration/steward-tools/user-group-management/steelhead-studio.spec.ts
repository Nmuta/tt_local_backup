import { login } from '@support/steward/auth/login';
import { stewardUrls } from '@support/steward/urls';
import { disableFakeApi } from '@support/steward/util/disable-fake-api'
import { calebStudio, chad, madden } from '@support/steward/common/account-info';
import { waitForProgressSpinners } from '@support/steward/common/wait-for-progress-spinners';
import { addManyUsersByGTag, addManyUsersByXUID, addOneUserByGTag, addOneUserByXUID, allUsersDisabledTest, findLiveOpsDevGroupTest, invalidGamerTagTest, invalidXUIDTest, noVIPLoadTest, removeManyUsersByGTag, removeManyUsersByXUID, removeOneUserByGTag, removeOneUserByXUID, selectLspGroupUGM } from './shared-fucntions';

context('Steward / Tools / User Group Management / Woodstock', () => {
  beforeEach(() => {
    login();

    disableFakeApi();
    cy.visit(stewardUrls.tools.userGroupManagement.steelhead);
    cy.get('span').contains('mat-icon', 'settings').click();
    cy.get('mat-form-field').contains('span', 'Flight').click();
    cy.get('mat-option').contains('span', 'Studio').click();
    cy.get('span').contains('mat-icon', 'settings').click();
    cy.contains('span', 'Studio').should('exist');
  });

  context('Basic Tests', () => {
    it('should be in Studio', () => {
      cy.contains('span', 'Studio').should('exist');
    });

    findLiveOpsDevGroupTest('LiveOpsTestingGroup', calebStudio);
    addOneUserByXUID('LiveOpsTestingGroup', madden);
    removeOneUserByXUID('LiveOpsTestingGroup', madden);
    addManyUsersByXUID('LiveOpsTestingGroup', madden, chad);
    removeManyUsersByXUID('LiveOpsTestingGroup', madden, chad);
    addOneUserByGTag('LiveOpsTestingGroup', madden);
    removeOneUserByGTag('LiveOpsTestingGroup', madden);
    addManyUsersByGTag('LiveOpsTestingGroup', madden, chad);
    removeManyUsersByGTag('LiveOpsTestingGroup', madden, chad);

    it('should remove all users (and put them back in)', () => {
      selectLspGroupUGM('LiveOpsTestingGroup');
      cy.get('[cyid="verifyDeleteAll"]').click();
      cy.contains('button', 'Delete All Users').click();
      waitForProgressSpinners();
      cy.contains('td', calebStudio.xuid).should('not.exist');

      //Add the users back to the group
      cy.contains('mat-form-field', 'Player XUIDs').click().type(calebStudio.xuid);
      //this is the checkbox next to the "Add Users" button
      cy.get('[cyid="verifyAdd"]').click();
      cy.contains('button', 'Add Users').click();
      waitForProgressSpinners();
      cy.contains('td', calebStudio.xuid).should('exist');
    });
  });

  context('Invalid Input Checks', () => {
    invalidXUIDTest('LiveOpsTestingGroup');

    invalidGamerTagTest('LiveOpsTestingGroup');
  });

  context('Edge cases', () => {
    allUsersDisabledTest();

    noVIPLoadTest();
  });
});
