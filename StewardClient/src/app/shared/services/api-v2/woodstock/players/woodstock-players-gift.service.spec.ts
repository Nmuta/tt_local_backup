import { TestBed } from '@angular/core/testing';

import { WoodstockPlayersGiftingService } from './woodstock-players-gifting.service';

describe('WoodstockPlayerSGiftingService', () => {
  let service: WoodstockPlayersGiftingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WoodstockPlayersGiftingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
