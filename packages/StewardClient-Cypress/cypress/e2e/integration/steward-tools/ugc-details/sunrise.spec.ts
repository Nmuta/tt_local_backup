import { stewardUrls } from '@support/steward/urls';
import { sunriseSamples, testInputUgcID } from './shared-functions';
import { resetToDefaultState } from '@support/page-utility/reset-to-default-state';
import { Tag, withTags } from '@support/tags';

// get model-dump-simple-table happens right after inputting a UGC id,
// and it can take more than 4 seconds, causing a timeout. This get is parallel to the progress spinners
// but not tracked by them, causing failures occasionally
context('Steward / Tools / UGC Details / Sunrise', withTags(Tag.Flakey), () => {
  before(() => {
    resetToDefaultState();
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
