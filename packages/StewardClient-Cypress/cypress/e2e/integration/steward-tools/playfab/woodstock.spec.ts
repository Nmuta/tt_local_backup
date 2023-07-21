import { login } from '@support/steward/auth/login';
import { stewardUrls } from '@support/steward/urls';
import { disableFakeApi } from '@support/steward/util/disable-fake-api';

interface playfabBuild{
  name: string;
  id: string;
}

const builds: Record<string, playfabBuild> = {
  build1: {
    name: 'Escrow_A5C772EA.601203..A0A17.Dev.-1_Event_Secure.woodstock_dlc2.20230714090949',
    id: '090409c0-04d2-46ce-b8b0-2e1ea34303d1',
  },

  build2: {
    name: 'Escrow_6A07F63E.603217..A0A17.Dev.-1_Life_Secure.woodstock.20230721020822',
    id: '0ef14c70-cbcf-408c-89c9-3bef46a9806f'
  }
}

context('Steward / Tools / PlayFab / Woodstock', () => {
  beforeEach(() => {
    login();

    disableFakeApi();
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
    cy.contains('mat-form-field', 'Search builds').click().type(builds.build1.id);

    cy.get('button').contains('mat-icon', 'close').parents('button').click();

    cy.get('tr').contains('td', builds.build1.name).should('exist');
    cy.get('tr').contains('td', builds.build1.id).should('exist');
    cy.get('tr').contains('td', builds.build2.name).should('exist');
    cy.get('tr').contains('td', builds.build2.id).should('exist');
  });

  it('should click the Locked button and populate', () => {
    cy.get('button').contains('span', 'Locked').parents('button').click();

    cy.contains('tr').should('not.exist');
  });

  it('should click the Unlocked button and populate', () => {
    cy.get('button').contains('span', 'Unlocked').parents('button').click();

    cy.get('tr').contains('td', builds.build1.name).should('exist');
    cy.get('tr').contains('td', builds.build1.id).should('exist');
    cy.get('tr').contains('td', builds.build2.name).should('exist');
    cy.get('tr').contains('td', builds.build2.id).should('exist');
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
