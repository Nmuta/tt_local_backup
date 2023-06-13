import { login } from '@support/steward/auth/login';
import { stewardUrls } from '@support/steward/urls';
import { disableFakeApi } from '@support/steward/util/disable-fake-api';
import { RetailUsers } from '@support/steward/common/account-info';
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
    cy.visit(stewardUrls.tools.userGroupManagement.apollo);
  });

  context('Basic Tests', () => {
    findLiveOpsDevGroupTest('Live Ops Developers', RetailUsers['jordan']);
    addOneUserByXUID('Live Ops Developers', RetailUsers['ben']);
    removeOneUserByXUID('Live Ops Developers', RetailUsers['ben']);
    addManyUsersByXUID('Live Ops Developers', RetailUsers['ben'], RetailUsers['chad']);
    removeManyUsersByXUID('Live Ops Developers', RetailUsers['ben'], RetailUsers['chad']);
    addOneUserByGTag('Live Ops Developers', RetailUsers['ben']);
    removeOneUserByGTag('Live Ops Developers', RetailUsers['ben']);
    addManyUsersByGTag('Live Ops Developers', RetailUsers['ben'], RetailUsers['chad']);
    removeManyUsersByGTag('Live Ops Developers', RetailUsers['ben'], RetailUsers['chad']);
    removeAllUsersThenReplace('Live Ops Developers', [
      RetailUsers['jordan'],
      RetailUsers['madden'],
      RetailUsers['luke'],
    ]);
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
