import { resetToDefaultState } from '@support/page-utility/reset-to-default-state';
import { stewardUrls } from '@support/steward/urls';
import { testEditButton, testEnvLoads, testInvalidEdits } from './shared-funtions';

context('Steward / Tools / LSP Task Management / Steelhead', () => {
  before(() => {
    resetToDefaultState();
    cy.visit(stewardUrls.tools.lspTasks.steelhead);
  });

  testEnvLoads();
  testEditButton();
  testInvalidEdits();
});
