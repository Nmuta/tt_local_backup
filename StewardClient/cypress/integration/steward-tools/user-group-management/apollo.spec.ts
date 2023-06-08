import { login } from '@support/steward/auth/login';
import { stewardUrls } from '@support/steward/urls';
import { disableFakeApi } from '@support/steward/util/disable-fake-api';
import { ben, chad, jordan, luke, madden } from '@support/steward/common/account-info';
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
    findLiveOpsDevGroupTest('Live Ops Developers', jordan);
    addOneUserByXUID('Live Ops Developers', ben);
    removeOneUserByXUID('Live Ops Developers', ben);
    addManyUsersByXUID('Live Ops Developers', ben, chad);
    removeManyUsersByXUID('Live Ops Developers', ben, chad);
    addOneUserByGTag('Live Ops Developers', ben);
    removeOneUserByGTag('Live Ops Developers', ben);
    addManyUsersByGTag('Live Ops Developers', ben, chad);
    removeManyUsersByGTag('Live Ops Developers', ben, chad);
    removeAllUsersThenReplace('Live Ops Developers', [jordan, madden, luke]);
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
