import { login } from '@support/steward/auth/login';
import { stewardUrls } from '@support/steward/urls';
import { disableFakeApi } from '@support/steward/util/disable-fake-api';
import { selectLspGroup } from './shared-fucntions';

context('Steward / Tools / User Group Management / Woodstock', () => {
  beforeEach(() => {
    login();

    disableFakeApi();
  });

  context('Edge cases', () => {
    beforeEach(() => {
      cy.visit(stewardUrls.tools.userGroupManagement.woodstock);
    });

    it('should be disabled for AllUsers', () => {
      selectLspGroup('AllUsers');
      cy.contains('mat-card', "Player management disabled for All User's Group").should('exist');
    });

    it('should not load VIP', () => {
      selectLspGroup('VIP');
      cy.contains('span', 'This user group is too large to load users').should('exist');
    });
  });
});
