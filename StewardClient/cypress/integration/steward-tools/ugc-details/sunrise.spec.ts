import { login } from '@support/steward/auth/login';
import { stewardUrls } from '@support/steward/urls';
import { disableFakeApi } from '@support/steward/util/disable-fake-api';
import {
  SunriseUgcCreatedDate,
  SunriseUgcID,
  testInputUgcID,
  verifyUgcCreatedDate,
} from './shared-functions';

context('Steward / Tools / UGC Details / Sunrise', () => {
  beforeEach(() => {
    login();

    disableFakeApi();
    cy.visit(stewardUrls.tools.ugcDetails.sunrise);
  });

  context('Basic Tests', () => {
    it('should find Livery data', () => {
      testInputUgcID(SunriseUgcID.Livery);
      verifyUgcCreatedDate(SunriseUgcCreatedDate.Livery);
    });

    //No Known Layer Groups to Test
    // it('should find Layer Group data', () => {
    //   testLayerGroup('*insert ugcid here*', '*insert created date here*');
    // });

    it('should find Photo data', () => {
      testInputUgcID(SunriseUgcID.Photo);
      verifyUgcCreatedDate(SunriseUgcCreatedDate.Photo);
    });

    it('should find Tune data', () => {
      testInputUgcID(SunriseUgcID.Livery);
      verifyUgcCreatedDate(SunriseUgcCreatedDate.Livery);
    });

    it('should find Events data', () => {
      testInputUgcID(SunriseUgcID.Livery);
      verifyUgcCreatedDate(SunriseUgcCreatedDate.Livery);
    });
  });
});
