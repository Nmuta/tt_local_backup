import { login } from "@support/steward/auth/login";
import { stewardUrls } from "@support/steward/urls";
import { disableFakeApi } from "@support/steward/util/disable-fake-api";
import { searchByGtag, searchByT10Id, searchByXuid } from '@support/steward/shared-functions/searching';
import { StudioUsers } from "@support/steward/common/account-info";
import { steelheadResults, testInvalidSearches, testLookup, testLookupWithFilter, testLookupWithInvalidFilter, testPlayerProfilesPopulated, testShowAllRows } from "./shared-functions";
import { changeEndpoint } from "@support/steward/shared-functions/change-endpoint";

context('Steward / Tools / Services Table Storage / Steelhead', () => {
  beforeEach(() => {
    login();

    disableFakeApi();
    cy.visit(stewardUrls.tools.servicesTableStorage.steelhead);
    changeEndpoint('Steelhead', 'Flight', 'Studio')
  });

  testInvalidSearches();

  context('Gtag Tests', () => {
    beforeEach(() => {
      searchByGtag(StudioUsers['caleb'].gtag);
    });

    testPlayerProfilesPopulated();
    testLookup(steelheadResults.noFilter);
    testLookupWithFilter(steelheadResults.CMSOverrideFilter);
    testShowAllRows(steelheadResults.showAllRows);
    testLookupWithInvalidFilter();
  });

  context('Xuid Tests', () => {
    beforeEach(() => {
      searchByXuid(StudioUsers['caleb'].xuid);
    });

    testPlayerProfilesPopulated();
    testLookup(steelheadResults.noFilter);
    testLookupWithFilter(steelheadResults.CMSOverrideFilter);
    testShowAllRows(steelheadResults.showAllRows);
    testLookupWithInvalidFilter();
  });

  // Takes an extremely long time, and the field to use T10 ID is "T10 ID" when the searchByT10Id function looks for "T10 Id"
  // context('T10 ID Tests', () => {
  //   beforeEach(() => {
  //     searchByT10Id(StudioUsers['caleb'].t10Id);
  //   });

  //   testPlayerProfilesPopulated();
  //   testLookup(steelheadResults.noFilter);
  //   testLookupWithFilter(steelheadResults.CMSOverrideFilter);
  //   testShowAllRows(steelheadResults.showAllRows);
  //   testLookupWithInvalidFilter();
  // });
});