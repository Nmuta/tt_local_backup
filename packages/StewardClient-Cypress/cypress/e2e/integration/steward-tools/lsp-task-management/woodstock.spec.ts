import { resetToDefaultState } from '@support/page-utility/reset-to-default-state';
import { stewardUrls } from '@support/steward/urls';
import { testEditButton, testEnvLoads, testInvalidEdits } from './shared-funtions';

context('Steward / Tools / LSP Task Management / Woodstock', () => {
  before(() => {
    resetToDefaultState();
    cy.visit(stewardUrls.tools.lspTasks.woodstock);
  });

  testEnvLoads();
  testEditButton();
  testInvalidEdits();
});
