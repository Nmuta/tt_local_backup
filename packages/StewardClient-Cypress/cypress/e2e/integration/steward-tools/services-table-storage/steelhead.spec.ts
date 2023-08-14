import { stewardUrls } from '@support/steward/urls';
import { searchByGtag, searchByXuid } from '@support/steward/shared-functions/searching';
import { StudioUsers } from '@support/steward/common/account-info';
import {
  steelheadResults,
  testInvalidSearches,
  testLookup,
  testLookupWithFilter,
  testLookupWithInvalidFilter,
  testPlayerProfilesPopulated,
  testShowAllRows,
} from './shared-functions';
import { changeEndpoint } from '@support/steward/shared-functions/change-endpoint';
import { resetToDefaultState } from '@support/page-utility/reset-to-default-state';

context('Steward / Tools / Services Table Storage / Steelhead', () => {
  before(() => {
    resetToDefaultState();
    cy.visit(stewardUrls.tools.servicesTableStorage.steelhead);
    changeEndpoint('Steelhead', 'Flight', 'Studio');
  });

  testInvalidSearches();

  context('Gtag Tests', () => {
    before(() => {
      searchByGtag(StudioUsers['caleb'].gtag);
    });

    testPlayerProfilesPopulated();
    testLookup(steelheadResults.noFilter);
    testLookupWithFilter(steelheadResults.CMSOverrideFilter);
    //Times out when Previous tests are run, completes when previous tests are commented out
    testShowAllRows(steelheadResults.showAllRows);
    testLookupWithInvalidFilter();
  });

  context('Xuid Tests', () => {
    before(() => {
      searchByXuid(StudioUsers['caleb'].xuid);
    });

    testPlayerProfilesPopulated();
    testLookup(steelheadResults.noFilter);
    testLookupWithFilter(steelheadResults.CMSOverrideFilter);
    testShowAllRows(steelheadResults.showAllRows);
    testLookupWithInvalidFilter();
  });
});
