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
import { withTags, Tag } from '@support/tags';

context('Steward / Tools / User Group Management / Woodstock', withTags(Tag.UnitTestStyle, Tag.Slow), () => {
  beforeEach(() => {
    login();

    disableFakeApi();
    cy.visit(stewardUrls.tools.userGroupManagement.woodstock);
  });

  context('Basic Tests', () => {
    findLiveOpsDevGroupTest('Live Ops Developers', RetailUsers['jordan']);
    addOneUserByXUID('Live Ops Developers', RetailUsers['luke']);
    removeOneUserByXUID('Live Ops Developers', RetailUsers['luke']);
    addManyUsersByXUID('Live Ops Developers', RetailUsers['luke'], RetailUsers['chad']);
    removeManyUsersByXUID('Live Ops Developers', RetailUsers['luke'], RetailUsers['chad']);
    addOneUserByGTag('Live Ops Developers', RetailUsers['luke']);
    removeOneUserByGTag('Live Ops Developers', RetailUsers['luke']);
    addManyUsersByGTag('Live Ops Developers', RetailUsers['luke'], RetailUsers['chad']);
    removeManyUsersByGTag('Live Ops Developers', RetailUsers['luke'], RetailUsers['chad']);
    removeAllUsersThenReplace('Live Ops Developers', [
      RetailUsers['ben'],
      RetailUsers['madden'],
      RetailUsers['jordan'],
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
