import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import faker from '@faker-js/faker';
import { fakePlayerUgcItem, PlayerUgcItem } from '@models/player-ugc-item';
import { UgcFeaturedStatus } from '@models/ugc-featured-status';
import { UgcType } from '@models/ugc-filters';
import { PipesModule } from '@shared/pipes/pipes.module';
import { DateTime, Duration } from 'luxon';
import { of } from 'rxjs';
import { SteelheadFeatureUgcModalComponent } from './steelhead-feature-ugc-modal.component';
import { createMockSteelheadUgcLookupService } from '@services/api-v2/steelhead/ugc/lookup/steelhead-ugc-lookup.service.mock';
import { createMockSteelheadUgcFeaturedStatusService } from '@services/api-v2/steelhead/ugc/featured-status/steelhead-ugc-featured-status.service.mock';
import { SteelheadUgcFeaturedStatusService } from '@services/api-v2/steelhead/ugc/featured-status/steelhead-ugc-featured-status.service';
import { SteelheadUgcLookupService } from '@services/api-v2/steelhead/ugc/lookup/steelhead-ugc-lookup.service';

describe('SteelheadFeatureUgcModalComponent', () => {
  const model: PlayerUgcItem = fakePlayerUgcItem();

  let fixture: ComponentFixture<SteelheadFeatureUgcModalComponent>;
  let component: SteelheadFeatureUgcModalComponent;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockMatDialogRef: any;
  let mockSteelheadUgcLookupService: SteelheadUgcLookupService = undefined;
  let mockSteelheadUgcFeaturedStatusService: SteelheadUgcFeaturedStatusService = undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SteelheadFeatureUgcModalComponent],
      imports: [MatButtonModule, MatDialogModule, PipesModule],
      providers: [
        createMockSteelheadUgcLookupService(),
        createMockSteelheadUgcFeaturedStatusService(),
        {
          provide: MatDialogRef,
          useValue: { close: () => null, beforeClosed: () => of() },
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: model,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SteelheadFeatureUgcModalComponent);
    component = fixture.componentInstance;
    mockSteelheadUgcLookupService = TestBed.inject(SteelheadUgcLookupService);
    mockSteelheadUgcFeaturedStatusService = TestBed.inject(SteelheadUgcFeaturedStatusService);

    fixture.detectChanges();

    mockMatDialogRef = TestBed.inject(MatDialogRef);
    mockMatDialogRef.close = jasmine.createSpy('close');
    mockMatDialogRef.beforeClosed = jasmine.createSpy('beforeClosed').and.returnValue(of());
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: setUgcfeatureStatus', () => {
    const item = fakePlayerUgcItem();

    beforeEach(() => {
      component.changeFeaturedStatus$ = jasmine
        .createSpy('changeFeaturedStatus$')
        .and.returnValue(of(item));
    });

    describe('When formGroup is valid', () => {
      beforeEach(() => {
        component.formControls.featuredDate.setValue(DateTime.local().plus(100));
      });

      it('should call component.changeFeaturedStatus$()', () => {
        component.setUgcfeatureStatus();

        expect(component.changeFeaturedStatus$).toHaveBeenCalled();
      });
    });

    describe('When formGroup is invalid', () => {
      beforeEach(() => {
        component.formControls.featuredDate.setValue(DateTime.utc().minus(10_000));
      });

      it('should not call component.changeFeaturedStatus$()', () => {
        component.setUgcfeatureStatus();

        expect(component.changeFeaturedStatus$).not.toHaveBeenCalled();
      });
    });
  });

  describe('Method: changeFeaturedStatus$', () => {
    const itemId = faker.datatype.uuid().toString();
    const expireDate = DateTime.local().plus(Duration.fromMillis(10_000));
    const expireDuration = expireDate.diff(DateTime.local().startOf('day'));

    it('should call SteelheadUgcFeaturedStatusService.setUgcItemFeatureStatus() with correct params', () => {
      component.changeFeaturedStatus$(itemId, true, expireDate);

      expect(mockSteelheadUgcFeaturedStatusService.setUgcItemFeatureStatus$).toHaveBeenCalledWith({
        itemId: itemId,
        isFeatured: true,
        featuredExpiry: expireDuration,
      } as UgcFeaturedStatus);
    });
  });

  describe('Method: getUgcItem$', () => {
    const itemId = faker.datatype.uuid().toString();
    const type = UgcType.Livery;

    it('should call SteelheadUgcLookupService.getPlayerUgcItem$() with correct params', () => {
      component.getUgcItem$(itemId, type);

      expect(mockSteelheadUgcLookupService.getPlayerUgcItem$).toHaveBeenCalledWith(itemId, type);
    });
  });
});
