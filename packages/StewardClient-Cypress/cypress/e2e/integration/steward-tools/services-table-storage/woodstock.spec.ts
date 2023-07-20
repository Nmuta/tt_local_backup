import { login } from "@support/steward/auth/login";
import { stewardUrls } from "@support/steward/urls";
import { disableFakeApi } from "@support/steward/util/disable-fake-api";
import { searchByGtag, searchByT10Id, searchByXuid } from '@support/steward/shared-functions/searching';
import { RetailUsers } from "@support/steward/common/account-info";
import { testInvalidSearches, testLookup, testLookupWithFilter, testLookupWithInvalidFilter, testPlayerProfilesPopulated, testShowAllRows, woodstockResults } from "./shared-functions";

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

  // Takes an extremely long time, and the field to use T10 ID is "T10 ID" when the searchByT10Id function looks for "T10 Id"
  // context('T10 ID Tests', () => {
  //   beforeEach(() => {
  //     searchByT10Id(RetailUsers['jordan'].t10Id);
  //   });

  //   testPlayerProfilesPopulated();
  //   testLookup(woodstockResults.noFilter);
  //   testLookupWithFilter(woodstockResults.crossTitleHasPlayedRecordFilter);
  //   testShowAllRows(woodstockResults.showAllRows);
  //   testLookupWithInvalidFilter();
  // });
});