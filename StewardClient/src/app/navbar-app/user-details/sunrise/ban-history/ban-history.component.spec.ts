import { ComponentFixture, getTestBed, TestBed } from '@angular/core/testing';
import { SunriseService } from '@services/sunrise/sunrise.service';
import { createMockSunriseService } from '@services/sunrise/sunrise.service.mock';

import { BanHistoryComponent } from './ban-history.component';

describe('BanHistoryComponent', () => {
  let injector: TestBed;
  let service: SunriseService;
  let component: BanHistoryComponent;
  let fixture: ComponentFixture<BanHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BanHistoryComponent],
      providers: [createMockSunriseService()],
    }).compileComponents();
    
    injector = getTestBed();
    service = injector.inject(SunriseService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BanHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
