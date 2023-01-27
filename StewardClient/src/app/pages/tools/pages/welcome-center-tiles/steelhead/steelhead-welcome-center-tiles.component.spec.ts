import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, getTestBed, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { SteelheadWelcomeCenterTileService } from '@services/api-v2/steelhead/welcome-center-tiles/steelhead-welcome-center-tiles.service';
import { createMockSteelheadWelcomeCenterTileService } from '@services/api-v2/steelhead/welcome-center-tiles/steelhead-welcome-center-tiles.service.mock';
import { SteelheadWelcomeCenterTilesComponent } from './steelhead-welcome-center-tiles.component';

describe('SteelheadWelcomeCenterTilesComponent', () => {
  let component: SteelheadWelcomeCenterTilesComponent;
  let fixture: ComponentFixture<SteelheadWelcomeCenterTilesComponent>;
  let mockWelcomeCenterTileService: SteelheadWelcomeCenterTileService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
      ],
      declarations: [SteelheadWelcomeCenterTilesComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [createMockSteelheadWelcomeCenterTileService()],
    }).compileComponents();

    const injector = getTestBed();
    mockWelcomeCenterTileService = injector.inject(SteelheadWelcomeCenterTileService);

    fixture = TestBed.createComponent(SteelheadWelcomeCenterTilesComponent);
    component = fixture.debugElement.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: ngOnInit', () => {
    it('should call getWelcomeCenterTiles', () => {
      component.ngOnInit();

      expect(mockWelcomeCenterTileService.getWelcomeCenterTiles$).toHaveBeenCalled();
    });
  });
});
