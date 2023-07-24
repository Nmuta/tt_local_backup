import { login } from '@support/steward/auth/login';
import { stewardUrls } from '@support/steward/urls';
import { disableFakeApi } from '@support/steward/util/disable-fake-api';
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

context('Steward / Tools / Services Table Storage / Woodstock', () => {
  beforeEach(() => {
    login();

    disableFakeApi();
    cy.visit(stewardUrls.tools.servicesTableStorage.woodstock);
  });

  testInvalidSearches();

  context('Gtag Tests', () => {
    beforeEach(() => {
      searchByGtag(RetailUsers['jordan'].gtag);
    });

    testPlayerProfilesPopulated();
    testLookup(woodstockResults.noFilter);
    testLookupWithFilter(woodstockResults.crossTitleHasPlayedRecordFilter);
    testShowAllRows(woodstockResults.showAllRows);
    testLookupWithInvalidFilter();
  });

  context('Xuid Tests', () => {
    beforeEach(() => {
      searchByXuid(RetailUsers['jordan'].xuid);
    });

    testPlayerProfilesPopulated();
    testLookup(woodstockResults.noFilter);
    testLookupWithFilter(woodstockResults.crossTitleHasPlayedRecordFilter);
    testShowAllRows(woodstockResults.showAllRows);
    testLookupWithInvalidFilter();
  });
});
