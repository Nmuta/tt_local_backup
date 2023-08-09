import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { WoodstockPlayFabPlayerTransactionsService } from './woodstock-playfab-player-transactions.service';

describe('WoodstockPlayFabPlayerTransactionsService', () => {
  let service: WoodstockPlayFabPlayerTransactionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(WoodstockPlayFabPlayerTransactionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
