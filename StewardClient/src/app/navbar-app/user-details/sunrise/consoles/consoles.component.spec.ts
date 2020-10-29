import { ComponentFixture, getTestBed, TestBed, waitForAsync } from '@angular/core/testing';
import { SunriseService } from '@services/sunrise/sunrise.service';
import { createMockSunriseService } from '@services/sunrise/sunrise.service.mock';

import { ConsolesComponent } from './consoles.component';

describe('ConsolesComponent', () => {
  let injector: TestBed;
  let service: SunriseService;
  let component: ConsolesComponent;
  let fixture: ComponentFixture<ConsolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConsolesComponent],
      providers: [createMockSunriseService()],
    }).compileComponents();
    
    injector = getTestBed();
    service = injector.inject(SunriseService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', waitForAsync(() => {
    expect(component).toBeTruthy();
  }));
});
