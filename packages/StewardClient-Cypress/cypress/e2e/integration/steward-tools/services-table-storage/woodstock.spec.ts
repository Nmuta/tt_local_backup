import { stewardUrls } from '@support/steward/urls';
import { searchByGtag, searchByXuid } from '@support/steward/shared-functions/searching';
import { RetailUsers } from '@support/steward/common/account-info';
import {
  testInvalidSearches,
  testLookup,
  testLookupWithFilter,
  testLookupWithInvalidFilter,
  testPlayerProfilesPopulated,
  testShowAllRows,
  woodstockResults,
} from './shared-functions';
import { resetToDefaultState } from '@support/page-utility/reset-to-default-state';

context('Steward / Tools / Services Table Storage / Woodstock', () => {
  before(() => {
    resetToDefaultState();
    cy.visit(stewardUrls.tools.servicesTableStorage.woodstock);
  });

  testInvalidSearches();

  context('Gtag Tests', () => {
    before(() => {
      searchByGtag(RetailUsers['jordan'].gtag);
    });

    testPlayerProfilesPopulated();
    testLookup(woodstockResults.noFilter);
    testLookupWithFilter(woodstockResults.crossTitleHasPlayedRecordFilter);
    testShowAllRows(woodstockResults.showAllRows);
    testLookupWithInvalidFilter();
  });

  context('Xuid Tests', () => {
    before(() => {
      searchByXuid(RetailUsers['jordan'].xuid);
    });

    testPlayerProfilesPopulated();
    testLookup(woodstockResults.noFilter);
    testLookupWithFilter(woodstockResults.crossTitleHasPlayedRecordFilter);
    testShowAllRows(woodstockResults.showAllRows);
    testLookupWithInvalidFilter();
  });
});
