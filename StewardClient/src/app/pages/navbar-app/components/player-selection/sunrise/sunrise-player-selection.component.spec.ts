import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, getTestBed, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule } from '@ngxs/store';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SunrisePlayerSelectionComponent } from './sunrise-player-selection.component';
import { createMockSunriseService, SunriseService } from '@services/sunrise';

describe('SunrisePlayerSelectionComponent', () => {
  let fixture: ComponentFixture<SunrisePlayerSelectionComponent>;
  let component: SunrisePlayerSelectionComponent;

  let mockSunriseService: SunriseService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule.withRoutes([]),
          HttpClientTestingModule,
          NgxsModule.forRoot(),
        ],
        declarations: [SunrisePlayerSelectionComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [createMockSunriseService()],
      }).compileComponents();

      const injector = getTestBed();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      mockSunriseService = injector.inject(SunriseService);

      fixture = TestBed.createComponent(SunrisePlayerSelectionComponent);
      component = fixture.debugElement.componentInstance;
    }),
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
