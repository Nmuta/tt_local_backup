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
    removeAllUsersThenReplace('Live Ops Developers', [ben, madden, jordan]);
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
