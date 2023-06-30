import { login } from '@support/steward/auth/login';
import { stewardUrls } from '@support/steward/urls';
import { disableFakeApi } from '@support/steward/util/disable-fake-api';
import { testEvents, testLivery, testPhoto, testTune } from './shared-functions';

context('Steward / Tools / UGC Details / Sunrise', () => {
  beforeEach(() => {
    login();

    disableFakeApi();
    cy.visit(stewardUrls.tools.ugc_details.sunrise);
  });

  context('Basic Tests', () => {
    it('should find Livery data', () => {
      testLivery('0f8d8e88-6ecb-43ab-b386-6b56c9889390', '3/15/21 8:30:02 AM');
    });

    //No Known Layer Groups to Test
    // it('should find Layer Group data', () => {
    //   testLayerGroup('*insert ugcid here*', '*insert created date here*');
    // });

    it('should find Photo data', () => {
      testPhoto('cb276ca9-9e62-4493-bf21-5b1021de5098', '1/10/21 8:06:05 PM');
    });

    it('should find Tune data', () => {
      testTune('513c0c47-150b-45ca-912e-39d6728f6f9b', '12/3/20 5:15:51 PM');
    });

    it('should find Events data', () => {
      testEvents('740b5d6a-5b10-44d1-882a-e647f42b910f', '10/11/18 5:51:25 PM');
    });
  });
});
