import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, getTestBed, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { SteelheadDeeplinkTileService } from '@services/api-v2/steelhead/welcome-center-tiles/world-of-forza/deeplink/steelhead-deeplink-tiles.service';
import { createMockSteelheadDeeplinkTileService } from '@services/api-v2/steelhead/welcome-center-tiles/world-of-forza/deeplink/steelhead-deeplink-tiles.service.mock';
import { SteelheadGenericPopupTileService } from '@services/api-v2/steelhead/welcome-center-tiles/world-of-forza/generic-popup/steelhead-generic-popup-tiles.service';
import { createMockSteelheadGenericPopupTileService } from '@services/api-v2/steelhead/welcome-center-tiles/world-of-forza/generic-popup/steelhead-generic-popup-tiles.service.mock';
import { SteelheadImageTextTileService } from '@services/api-v2/steelhead/welcome-center-tiles/world-of-forza/image-text/steelhead-image-text-tiles.service';
import { createMockSteelheadImageTextTileService } from '@services/api-v2/steelhead/welcome-center-tiles/world-of-forza/image-text/steelhead-image-text-tiles.service.mock';
import { PipesModule } from '@shared/pipes/pipes.module';
import { SteelheadWelcomeCenterTilesComponent } from './steelhead-welcome-center-tiles.component';

describe('SteelheadWelcomeCenterTilesComponent', () => {
  let component: SteelheadWelcomeCenterTilesComponent;
  let fixture: ComponentFixture<SteelheadWelcomeCenterTilesComponent>;
  let mockSteelheadImageTextTileService: SteelheadImageTextTileService;
  let mockSteelheadGenericPopupTileService: SteelheadGenericPopupTileService;
  let mockSteelheadDeeplinkTileService: SteelheadDeeplinkTileService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        PipesModule,
      ],
      declarations: [SteelheadWelcomeCenterTilesComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        createMockSteelheadImageTextTileService(),
        createMockSteelheadGenericPopupTileService(),
        createMockSteelheadDeeplinkTileService(),
      ],
    }).compileComponents();

    const injector = getTestBed();
    mockSteelheadImageTextTileService = injector.inject(SteelheadImageTextTileService);
    mockSteelheadGenericPopupTileService = injector.inject(SteelheadGenericPopupTileService);
    mockSteelheadDeeplinkTileService = injector.inject(SteelheadDeeplinkTileService);

    fixture = TestBed.createComponent(SteelheadWelcomeCenterTilesComponent);
    component = fixture.debugElement.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: ngOnInit', () => {
    it('should call getImageTextTiles', () => {
      component.ngOnInit();

      expect(mockSteelheadImageTextTileService.getImageTextTiles$).toHaveBeenCalled();
      expect(mockSteelheadGenericPopupTileService.getGenericPopupTiles$).toHaveBeenCalled();
      expect(mockSteelheadDeeplinkTileService.getDeeplinkTiles$).toHaveBeenCalled();
    });
  });
});
