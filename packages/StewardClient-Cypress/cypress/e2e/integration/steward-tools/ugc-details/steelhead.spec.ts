import { stewardUrls } from '@support/steward/urls';
import { testInputUgcID, steelheadSamples } from './shared-functions';
import { resetToDefaultState } from '@support/page-utility/reset-to-default-state';
import { Tag, withTags } from '@support/tags';

// get model-dump-simple-table happens right after inputting a UGC id,
// and it can take more than 4 seconds, causing a timeout. This get is parallel to the progress spinners
// but not tracked by them, causing failures occasionally
context('Steward / Tools / UGC Details / Steelhead', withTags(Tag.Flakey), () => {
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
