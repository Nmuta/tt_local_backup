import { login } from '@support/steward/auth/login';
import { stewardUrls } from '@support/steward/urls';
import { disableFakeApi } from '@support/steward/util/disable-fake-api';
import { testInputUgcID, steelheadSamples } from './shared-functions';

context('Steward / Tools / UGC Details / Woodstock', () => {
  beforeEach(() => {
    login();

    disableFakeApi();
    cy.visit(stewardUrls.tools.ugcDetails.steelhead);
  });

  context('Basic Tests', () => {
    it('should find Livery data', () => {
      testInputUgcID(steelheadSamples.livery);
    });

    it('should find Photo data', () => {
      testInputUgcID(steelheadSamples.photo);
    });

    it('should find Tune Blob data', () => {
      testInputUgcID(steelheadSamples.tuneBlob);
    });
  });
});
