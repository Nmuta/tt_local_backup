import { login } from '@support/steward/auth/login';
import { stewardUrls } from '@support/steward/urls';
import { disableFakeApi } from '@support/steward/util/disable-fake-api';
import { searchByGtag } from '@support/steward/shared-functions/searching';
import { RetailUsers } from '@support/steward/common/account-info';
import { waitForProgressSpinners } from '@support/steward/common/wait-for-progress-spinners';
import { tableHasEntry } from '@support/mat-form/table-has-entry';
import {
  clickSearch,
  selectCar,
  selectCuratedUgcType,
  selectUgcType,
  orderUgcBy,
} from './page';
import { clickIfExists } from '@support/cypress/click-if-exists';

const defaultWoodstockUser = RetailUsers['ben'];
const ugcTypes = [
  'Livery',
  'LayerGroup',
  'Photo',
  'Tune',
  'EventBlueprint',
  // TODO: Currently no accounts hava a community challenge ugc.
  // 'CommunityChallenge',
];
const woodstockSamples: Record<string, string> = {
  Livery: 'b9c6305b-5d41-4f3c-9c82-f9822a2159ce',
  LayerGroup: 'f325a1ad-1423-41f7-ab58-fb989a37164e',
  Photo: '9b2faeff-8f0d-4bad-9878-7c6aea7ba50c',
  Tune: '3f51c8ac-4ca3-4f3f-ad38-1f34d5b7458e',
  EventBlueprint: 'dc3bb176-3f3e-4cb1-a6a4-0a049423af14',
};

context('Steward / Tools / UGC Details / Woodstock', () => {
  before(() => {
    login();

    disableFakeApi();
    cy.visit(stewardUrls.tools.searchUgc.woodstock);
  });

  beforeEach(() => {
    clickIfExists('player-selection-single mat-chip mat-icon[matchipremove]');
  });

  it('Should provide an error for an invalid user', () => {
    searchByGtag('I am an invalid GTAG');
    cy.get('.player-not-found').should('exist');
  });

  it('Should load curated UGC', () => {
    selectCuratedUgcType('All Time Greats');
    cy.contains('button', 'Load Curated Ugc').click();
    waitForProgressSpinners();
    cy.get('woodstock-ugc-table').within(() => {
      cy.get('tbody').children().should('exist');
    });
  });

  it('Should load all types of user UGC for a valid user, filter for specific models, and sort them properly', () => {
    searchByGtag(defaultWoodstockUser.gtag);
    ugcTypes.forEach(ugcType => {
      selectUgcType(ugcType);
      clickSearch();
      cy.get('woodstock-ugc-table')
        .within(() => {
          tableHasEntry('metadata', woodstockSamples[ugcType]);
        })
        .should('exist');
    });
    selectUgcType('Livery');
    selectCar('DB5');
    orderUgcBy('Oldest first');
    clickSearch();
    waitForProgressSpinners();
    cy.get('woodstock-ugc-table')
      .within(() => {
        cy.get('.mat-row')
          .first()
          .within(() => {
            cy.contains('b890ab3c-c9c4-4678-b5cc-9c7fe84a1df8');
          });
      })
      .should('exist');
  });

  it('Should be able to hide, report, or generate share codes for ugc', () => {
    searchByGtag(RetailUsers['ben'].gtag);
    cy.contains('button', 'Search').click();
    waitForProgressSpinners();

    // Hide Ugc
    cy.get('woodstock-ugc-table').within(() => {
      cy.get('tbody').within(() => {
        cy.get('tr').first().click();
      });
    });
    cy.contains('button', 'Hide')
      .parent()
      .within(() => {
        cy.get('verify-button').click();
      });
    cy.contains('button', 'Hide').should('be.enabled');

    // Report Ugc
    cy.contains('mat-form-field', 'Report reason').within(() => {
      cy.get('mat-select').click();
    });
    cy.get('.cdk-overlay-container').contains('mat-option', 'Profanity').click();
    cy.contains('button', 'Report')
      .parent()
      .within(() => {
        cy.get('verify-button').click();
      });
    cy.contains('button', 'Report').should('be.enabled');

    // Generate share code for Ugc
    cy.contains('button', 'Generate')
      .parent()
      .within(() => {
        cy.get('verify-button').click();
      });
    cy.contains('button', 'Generate').should('be.enabled');
  });
});
