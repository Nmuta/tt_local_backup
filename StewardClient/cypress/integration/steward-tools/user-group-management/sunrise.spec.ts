import { login } from '@support/steward/auth/login';
import { stewardUrls } from '@support/steward/urls';
import { disableFakeApi } from '@support/steward/util/disable-fake-api';
import { chad, jordan, luke, madden } from '@support/steward/common/account-info';
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
    removeAllUsersThenReplace('Live Ops Developers', [madden, luke]);
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
