import { stewardUrls } from '@support/steward/urls';
import { woodstockSamples, testInputUgcID } from './shared-functions';
import { withTags, Tag } from '@support/tags';
import { resetToDefaultState } from '@support/page-utility/reset-to-default-state';

// get model-dump-simple-table happens right after inputting a UGC id,
// and it can take more than 4 seconds, causing a timeout. This get is parallel to the progress spinners
// but not tracked by them, causing failures occasionally
context('Steward / Tools / UGC Details / Woodstock', withTags(Tag.Flakey), () => {
  before(() => {
    resetToDefaultState();
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
