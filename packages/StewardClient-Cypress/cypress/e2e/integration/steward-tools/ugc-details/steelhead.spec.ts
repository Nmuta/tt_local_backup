import { stewardUrls } from '@support/steward/urls';
import { testInputUgcID, steelheadSamples } from './shared-functions';
import { resetToDefaultState } from '@support/page-utility/reset-to-default-state';

context('Steward / Tools / UGC Details / Steelhead', () => {
  before(() => {
    resetToDefaultState();
    cy.visit(stewardUrls.tools.ugcDetails.steelhead);
  });

  context('Basic Tests', () => {
    it('should find Livery data', () => {
      testInputUgcID(steelheadSamples.livery);
    });

    // No known Photos to Test
    // it('should find Photo data', () => {
    //   testInputUgcID(steelheadSamples.photo);
    // });

    it('should find Tune Blob data', () => {
      testInputUgcID(steelheadSamples.tuneBlob);
    });

    it('should find Layer Group data', () => {
      testInputUgcID(steelheadSamples.layerGroup);
    });
  });
});
