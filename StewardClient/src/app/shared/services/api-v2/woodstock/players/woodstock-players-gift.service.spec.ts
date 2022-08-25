import { TestBed } from '@angular/core/testing';

import { WoodstockPlayersGiftService } from './woodstock-players-gift.service';

describe('WoodstockPlayersGiftService', () => {
  let service: WoodstockPlayersGiftService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WoodstockPlayersGiftService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
