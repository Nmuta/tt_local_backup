import { stewardUrls } from '@support/steward/urls';
import { sunriseSamples, testInputUgcID } from './shared-functions';
import { withTags, Tag } from '@support/tags';
import { resetToDefaultState } from '@support/page-utility/reset-to-default-state';

context('Steward / Tools / UGC Details / Sunrise', withTags(Tag.UnitTestStyle), () => {
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
