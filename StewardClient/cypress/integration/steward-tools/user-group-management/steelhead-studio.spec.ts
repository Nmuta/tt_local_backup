import { login } from '@support/steward/auth/login';
import { stewardUrls } from '@support/steward/urls';
import { disableFakeApi } from '@support/steward/util/disable-fake-api';
import { calebStudio, chad, madden } from '@support/steward/common/account-info';
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
  removeAllUsersThenReplace,
  removeManyUsersByGTag,
  removeManyUsersByXUID,
  removeOneUserByGTag,
  removeOneUserByXUID,
} from './shared-functions';

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
    removeAllUsersThenReplace('LiveOpsTestingGroup', [calebStudio]);
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
