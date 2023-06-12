import { login } from '@support/steward/auth/login';
import { stewardUrls } from '@support/steward/urls';
import { disableFakeApi } from '@support/steward/util/disable-fake-api';
import { RetailUsers, StudioUsers } from '@support/steward/common/account-info';
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

    findLiveOpsDevGroupTest('LiveOpsTestingGroup', StudioUsers['caleb']);
    addOneUserByXUID('LiveOpsTestingGroup', RetailUsers['madden']);
    removeOneUserByXUID('LiveOpsTestingGroup', RetailUsers['madden']);
    addManyUsersByXUID('LiveOpsTestingGroup', RetailUsers['madden'], RetailUsers['chad']);
    removeManyUsersByXUID('LiveOpsTestingGroup', RetailUsers['madden'], RetailUsers['chad']);
    addOneUserByGTag('LiveOpsTestingGroup', RetailUsers['madden']);
    removeOneUserByGTag('LiveOpsTestingGroup', RetailUsers['madden']);
    addManyUsersByGTag('LiveOpsTestingGroup', RetailUsers['madden'], RetailUsers['chad']);
    removeManyUsersByGTag('LiveOpsTestingGroup', RetailUsers['madden'], RetailUsers['chad']);
    removeAllUsersThenReplace('LiveOpsTestingGroup', [StudioUsers['caleb']]);
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
