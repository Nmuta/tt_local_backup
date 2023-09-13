import { SUNRISE_LINK_GENERATOR } from './sunrise-link-generator';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe('SunriseLinkGenerator', () => {
  const generator = SUNRISE_LINK_GENERATOR;

  it('should exist', () => {
    expect(generator).toBeTruthy();
  });

  describe('AuctionDetailsLinkGenerator interface', () => {
    it('should implement makeAuctionDetailsRoute', () =>
      expect(generator.makeAuctionDetailsRoute('5')).toEqual([
        '',
        'app',
        'tools',
        'auction-details',
        'sunrise',
        '5',
      ]));
  });
});
