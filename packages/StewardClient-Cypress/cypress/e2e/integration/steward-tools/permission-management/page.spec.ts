import { resetToDefaultState } from '@support/page-utility/reset-to-default-state';
import { waitForProgressSpinners } from '@support/steward/common/wait-for-progress-spinners';
import { stewardUrls } from '@support/steward/urls';

context('Steward / Tools / Permission Management', () => {
  before(() => {
    resetToDefaultState();
    cy.visit(stewardUrls.tools.permissionManagement.default);
  });

  const permissionTestUser : string = 't10stewardtest@outlook.com';
  const permissionTestTeam : string = 'Luke\'s Test Team';

  context('Manage User Permissions', () => {
    before(() => {
      cy.contains('[role="tab"]', 'Manage User Permissions').click();
      waitForProgressSpinners();
    });
    it('Should be able to resync the DB, search for a user, change permissions, and undo', () => {
      cy.get('select-user-from-list').within(() =>{
        cy.contains('button', 'Sync Users DB').click();
        waitForProgressSpinners();
        cy.get('input').click().type(permissionTestUser+'{enter}');
        waitForProgressSpinners();
        cy.contains('.user-container', permissionTestUser).find('[aria-label="Select or unselect a user"]').click();
      })
      //cy.contains('mat-form-field','Tree View').click();
      //cy.contains('mat-option','Title Top Level').click();
      cy.contains('mat-card', 'Manage Permissions').within(()=>{
        cy.get('[aria-label="Toggle TitleAccess"]').click({multiple: true});
        cy.get('mat-checkbox').first().click();
        cy.contains('button', 'Undo Changes').click({force:true});
      });
    })
  });

  context('Kusto Management', () => {
    before(() => {
      cy.contains('[role="tab"]', 'Manage Teams').click();
      waitForProgressSpinners();
    });
    it('Should be able to create a new team in Manage Teams', () => {
      cy.contains('button', 'Create').should('be.disabled');
      cy.contains('mat-form-field', 'Team name').find('input').click().type('Cypress Test Team');
      cy.contains('mat-form-field', 'Team lead').find('input').click().type(permissionTestUser);
      cy.contains('mat-option', permissionTestUser).click();
      cy.contains('button', 'Create').should('not.be.disabled');
    });
    it('Should select an existing team, add and remove a user, save the changes, and be able to delete the team', () => {

      // Select team, confirm contents
      cy.contains('mat-form-field', 'Select team').find('input').click().type(permissionTestTeam);
      cy.contains('mat-option', permissionTestTeam).click();
      cy.contains('Luke Geiken (Luke.Geiken@microsoft.com)').should('exist');
      cy.contains('Isshak Ferdjani').should('exist');

      // Add User
      cy.contains('mat-form-field', 'Add user').find('input').click().type(permissionTestUser);
      cy.contains('mat-option', permissionTestUser).click();
      cy.contains('tr', permissionTestUser).should('exist');

      // Remove user by remove button
      cy.contains('tr', permissionTestUser).contains('button', 'Remove').click();

      // Add User
      cy.contains('mat-form-field', 'Add user').find('input').click().type(permissionTestUser);
      cy.contains('mat-option', permissionTestUser).click();

      // Remove user by mat chip
      cy.contains('mat-chip-list', 'Pending Additions:').contains('mat-chip', permissionTestUser).contains('button', 'close').click();
      cy.contains('tr', permissionTestUser).should('not.exist');

      // Save changes
      cy.contains('button', 'Save Changes').should('not.be.disabled');

      // Can delete
      cy.get('verify-button').click();
      cy.contains('button', 'Delete Team').should('not.be.disabled');
    })
  });
});
