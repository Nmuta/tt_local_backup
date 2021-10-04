import { TestBed } from '@angular/core/testing';

import { MultiEnvironmentService } from './multi-environment.service';
import { createMockGravityService } from '@services/gravity';
import { createMockApolloService } from '@services/apollo';
import { createMockOpusService } from '@services/opus';
import { createMockSteelheadService } from '@services/steelhead';
import { createMockSunriseService } from '@services/sunrise';
import { createMockWoodstockService } from '@services/woodstock';
import { NgxsModule } from '@ngxs/store';

describe('MultiEnvironmentService', () => {
  let service: MultiEnvironmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([])],
      providers: [
        createMockSunriseService(),
        createMockGravityService(),
        createMockApolloService(),
        createMockOpusService(),
        createMockSteelheadService(),
        createMockWoodstockService(),
      ],
    });
    service = TestBed.inject(MultiEnvironmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
