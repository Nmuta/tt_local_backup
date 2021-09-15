import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { faker } from '@interceptors/fake-api/utility';
import { fakePlayerUGCItem, PlayerUGCItem } from '@models/player-ugc-item';
import { UGCFeaturedStatus } from '@models/ugc-featured-status';
import { UGCType } from '@models/ugc-filters';
import { createMockWoodstockService, WoodstockService } from '@services/woodstock';
import { PipesModule } from '@shared/pipes/pipes.module';
import { DateTime, Duration } from 'luxon';
import { of } from 'rxjs';
import { WoodstockFeatureUGCModalComponent } from './woodstock-feature-ugc-modal.component';

describe('WoodstockFeatureUGCModalComponent', () => {
  const model: PlayerUGCItem = fakePlayerUGCItem();

  let fixture: ComponentFixture<WoodstockFeatureUGCModalComponent>;
  let component: WoodstockFeatureUGCModalComponent;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockMatDialogRef: any;
  let mockWoodstockService: WoodstockService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WoodstockFeatureUGCModalComponent],
      imports: [MatButtonModule, MatDialogModule, PipesModule],
      providers: [
        createMockWoodstockService(),
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

    fixture = TestBed.createComponent(WoodstockFeatureUGCModalComponent);
    component = fixture.componentInstance;
    mockWoodstockService = TestBed.inject(WoodstockService);

    fixture.detectChanges();

    mockMatDialogRef = TestBed.inject(MatDialogRef);
    mockMatDialogRef.close = jasmine.createSpy('close');
    mockMatDialogRef.beforeClosed = jasmine.createSpy('beforeClosed').and.returnValue(of());

    mockWoodstockService.getPlayerUGCItem = jasmine
      .createSpy('setUGCItemFeatureStatus')
      .and.returnValue(of(null));
    mockWoodstockService.setUGCItemFeatureStatus = jasmine
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

    it('should call WoodstockService.setUGCItemFeatureStatus() with correct params', () => {
      component.setFeaturedStatus$(itemId, expireDate);

      expect(mockWoodstockService.setUGCItemFeatureStatus).toHaveBeenCalledWith({
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

    it('should call WoodstockService.setUGCItemFeatureStatus() with correct params', () => {
      component.deleteFeaturedStatus$(itemId);

      expect(mockWoodstockService.setUGCItemFeatureStatus).toHaveBeenCalledWith({
        itemId: itemId,
        isFeatured: false,
      } as UGCFeaturedStatus);
    });
  });

  describe('Method: getUGCItem$', () => {
    const itemId = faker.datatype.uuid().toString();
    const type = UGCType.Livery;

    it('should call WoodstockService.getPlayerUGCItem() with correct params', () => {
      component.getUGCItem$(itemId, type);

      expect(mockWoodstockService.getPlayerUGCItem).toHaveBeenCalledWith(itemId, type);
    });
  });
});
