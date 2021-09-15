import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { faker } from '@interceptors/fake-api/utility';
import { fakePlayerUGCItem, PlayerUGCItem } from '@models/player-ugc-item';
import { UGCFeaturedStatus } from '@models/ugc-featured-status';
import { UGCType } from '@models/ugc-filters';
import { createMockSunriseService, SunriseService } from '@services/sunrise';
import { PipesModule } from '@shared/pipes/pipes.module';
import { DateTime, Duration } from 'luxon';
import { of } from 'rxjs';
import { SunriseFeatureUGCModalComponent } from './sunrise-feature-ugc-modal.component';

describe('SunriseFeatureUGCModalComponent', () => {
  const model: PlayerUGCItem = fakePlayerUGCItem();

  let fixture: ComponentFixture<SunriseFeatureUGCModalComponent>;
  let component: SunriseFeatureUGCModalComponent;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockMatDialogRef: any;
  let mockSunriseService: SunriseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SunriseFeatureUGCModalComponent],
      imports: [MatButtonModule, MatDialogModule, PipesModule],
      providers: [
        createMockSunriseService(),
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

    fixture = TestBed.createComponent(SunriseFeatureUGCModalComponent);
    component = fixture.componentInstance;
    mockSunriseService = TestBed.inject(SunriseService);

    fixture.detectChanges();

    mockMatDialogRef = TestBed.inject(MatDialogRef);
    mockMatDialogRef.close = jasmine.createSpy('close');
    mockMatDialogRef.beforeClosed = jasmine.createSpy('beforeClosed').and.returnValue(of());

    mockSunriseService.getPlayerUGCItem = jasmine
      .createSpy('setUGCItemFeatureStatus')
      .and.returnValue(of(null));
    mockSunriseService.setUGCItemFeatureStatus = jasmine
      .createSpy('setUGCItemFeatureStatus')
      .and.returnValue(of());
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: featureUGC', () => {
    const item = fakePlayerUGCItem();

    beforeEach(() => {
      component.setFeaturedStatus$ = jasmine
        .createSpy('setFeaturedStatus$')
        .and.returnValue(of(item));
    });

    describe('When formGroup is valid', () => {
      beforeEach(() => {
        component.formControls.featuredDate.setValue(DateTime.local().plus(100));
      });

      it('should call component.setFeaturedStatus$()', () => {
        component.featureUGC();

        expect(component.setFeaturedStatus$).toHaveBeenCalled();
      });
    });

    describe('When formGroup is invalid', () => {
      beforeEach(() => {
        component.formControls.featuredDate.setValue(null);
      });

      it('should not call component.setFeaturedStatus$()', () => {
        component.featureUGC();

        expect(component.setFeaturedStatus$).not.toHaveBeenCalled();
      });
    });
  });

  describe('Method: setFeaturedStatus$', () => {
    const itemId = faker.datatype.uuid().toString();
    const expireDate = DateTime.local().plus(Duration.fromMillis(10_000));
    const expireDuration = expireDate.diff(DateTime.local().startOf('day'));

    it('should call SunriseService.setUGCItemFeatureStatus() with correct params', () => {
      component.setFeaturedStatus$(itemId, expireDate);

      expect(mockSunriseService.setUGCItemFeatureStatus).toHaveBeenCalledWith({
        itemId: itemId,
        isFeatured: true,
        expiry: expireDuration,
      } as UGCFeaturedStatus);
    });
  });

  describe('Method: deleteFeaturedStatus$', () => {
    const itemId = faker.datatype.uuid().toString();
    const expireDate = DateTime.local();
    expireDate.plus(1);

    it('should call SunriseService.setUGCItemFeatureStatus() with correct params', () => {
      component.deleteFeaturedStatus$(itemId);

      expect(mockSunriseService.setUGCItemFeatureStatus).toHaveBeenCalledWith({
        itemId: itemId,
        isFeatured: false,
      } as UGCFeaturedStatus);
    });
  });

  describe('Method: getUGCItem$', () => {
    const itemId = faker.datatype.uuid().toString();
    const type = UGCType.Livery;

    it('should call SunriseService.getPlayerUGCItem() with correct params', () => {
      component.getUGCItem$(itemId, type);

      expect(mockSunriseService.getPlayerUGCItem).toHaveBeenCalledWith(itemId, type);
    });
  });
});
