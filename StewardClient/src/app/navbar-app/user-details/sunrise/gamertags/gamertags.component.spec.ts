import { ComponentFixture, getTestBed, TestBed, waitForAsync } from '@angular/core/testing';
import { SunriseService } from '@services/sunrise/sunrise.service';
import { createMockSunriseService } from '@services/sunrise/sunrise.service.mock';

import { GamertagsComponent } from './gamertags.component';

describe('GamertagsComponent', () => {
  let injector: TestBed;
  let service: SunriseService;
  let component: GamertagsComponent;
  let fixture: ComponentFixture<GamertagsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GamertagsComponent],
      providers: [createMockSunriseService()],
    }).compileComponents();
    
    injector = getTestBed();
    service = injector.inject(SunriseService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GamertagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', waitForAsync(() => {
    expect(component).toBeTruthy();
  }));
});
