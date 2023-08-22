import { resetToDefaultState } from '@support/page-utility/reset-to-default-state';
import { stewardUrls } from '@support/steward/urls';
import { withTags, Tag } from '@support/tags';

interface playfabBuild {
  name: string;
  id: string;
}

const builds: Record<string, playfabBuild> = {
  build1: {
    name: 'Release_68C7EC64.610708..2FE29.Dev.-1_Life_Secure.rc.20230822154037',
    id: '6644ac5e-e3eb-4e79-a6d3-0851fb86fa8c',
  },

  build2: {
    name: 'Release_EB770D4D.607493..2FE29.Dev.-1_Life_Secure.rc.20230807093631',
    id: '69b86a09-2624-41e9-84c2-f549bf0d5280',
  },
};

context('Steward / Tools / PlayFab / Woodstock', () => {
  before(() => {
    resetToDefaultState();
    cy.visit(stewardUrls.tools.playfab.woodstock);
  });

  it('should enter and display a build', () => {
    cy.contains('mat-form-field', 'Search builds').click().type(builds.build1.id);

    cy.get('tr').contains('td', builds.build1.name).should('exist');
    cy.get('tr').contains('td', builds.build1.id).should('exist');
    cy.get('tr').contains('td', builds.build2.name).should('not.exist');
    cy.get('tr').contains('td', builds.build2.id).should('not.exist');
  });

  it('should enter a build id, clear the filter, and populate', () => {
    cy.get('button').contains('mat-icon', 'close').parents('button').click();

    cy.get('tr').contains('td', builds.build1.name).should('exist');
    cy.get('tr').contains('td', builds.build1.id).should('exist');
    cy.get('tr').contains('td', builds.build2.name).should('exist');
    cy.get('tr').contains('td', builds.build2.id).should('exist');
  });

  it('should click the Locked button and populate', withTags(Tag.Broken), () => {
    cy.get('button').contains('span', 'Locked').parents('button').click();

    cy.get('tr').contains('td', builds.build1.name).should('not.exist');
    cy.get('tr').contains('td', builds.build1.id).should('not.exist');
    cy.get('tr').contains('td', builds.build2.name).should('exist');
    cy.get('tr').contains('td', builds.build2.id).should('exist');
  });

  it('should click the Unlocked button and populate', withTags(Tag.Broken), () => {
    cy.get('button').contains('span', 'Unlocked').parents('button').click();

    cy.get('tr').contains('td', builds.build1.name).should('exist');
    cy.get('tr').contains('td', builds.build1.id).should('exist');
    cy.get('tr').contains('td', builds.build2.name).should('not.exist');
    cy.get('tr').contains('td', builds.build2.id).should('not.exist');
  });

  it('should enter an invalid build id and populate nothing', () => {
    cy.contains('mat-form-field', 'Search builds').click().type('TotallyRealID');

    cy.contains('tr').should('not.exist');
  });

  it('should click the PlayFab Settings button', () => {
    cy.contains('a', 'PlayFab Settings').click();

    cy.contains('mat-form-field', 'Max Build Locks').should('exist');
  });
});
