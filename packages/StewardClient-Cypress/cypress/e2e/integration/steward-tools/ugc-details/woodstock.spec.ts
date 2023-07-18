import { login } from '@support/steward/auth/login';
import { stewardUrls } from '@support/steward/urls';
import { disableFakeApi } from '@support/steward/util/disable-fake-api';
import { woodstockSamples, testInputUgcID } from './shared-functions';

context('Steward / Tools / UGC Details / Woodstock', () => {
  beforeEach(() => {
    login();

    disableFakeApi();
    cy.visit(stewardUrls.tools.ugcDetails.woodstock);
  });

  context('Basic Tests', () => {
    it('should find Livery data', () => {
      testInputUgcID(woodstockSamples.livery);
    });

    it('should find Layer Group data', () => {
      testInputUgcID(woodstockSamples.layerGroup);
    });

    it('should find Photo data', () => {
      testInputUgcID(woodstockSamples.photo);
    });

    it('should find Tune data', () => {
      testInputUgcID(woodstockSamples.tune);
    });

    //No Known Events to Test
    // it('should find Events data', () => {
    //   testInputUgcID('*insert ugcid here*');
    //verifyUgcCreatedDate('*insert created date here*');
    // });

    //No Known Community Challenges to Test
    // it('should find Events data', () => {
    //   testInputUgcID('*insert ugcid here*');
    //verifyUgcCreatedDate('*insert created date here*');
    // });
  });
});
