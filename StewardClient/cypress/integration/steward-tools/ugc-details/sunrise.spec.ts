import { login } from '@support/steward/auth/login';
import { stewardUrls } from '@support/steward/urls';
import { disableFakeApi } from '@support/steward/util/disable-fake-api';
import { sunriseSamples, testInputUgcID } from './shared-functions';

context('Steward / Tools / UGC Details / Sunrise', () => {
  beforeEach(() => {
    login();

    disableFakeApi();
    cy.visit(stewardUrls.tools.ugcDetails.sunrise);
  });

  context('Basic Tests', () => {
    it('should find Livery data', () => {
      testInputUgcID(sunriseSamples.livery);
    });

    //No Known Layer Groups to Test
    // it('should find Layer Group data', () => {
    //   testLayerGroup('*insert ugcid here*', '*insert created date here*');
    // });

    it('should find Photo data', () => {
      testInputUgcID(sunriseSamples.photo);
    });

    it('should find Tune data', () => {
      testInputUgcID(sunriseSamples.tune);
    });

    it('should find Events data', () => {
      testInputUgcID(sunriseSamples.events);
    });
  });
});
