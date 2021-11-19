import { WOODSTOCK_LINK_GENERATOR } from './woodstock-link-generator';

describe('WoodstockLinkGenerator', () => {
  const generator = WOODSTOCK_LINK_GENERATOR;

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
        'woodstock',
        '5',
      ]));
  });
});
