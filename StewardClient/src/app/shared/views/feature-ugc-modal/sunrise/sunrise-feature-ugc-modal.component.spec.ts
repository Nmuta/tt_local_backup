import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import faker from '@faker-js/faker';
import { fakePlayerUgcItem, PlayerUgcItem } from '@models/player-ugc-item';
import { UgcFeaturedStatus } from '@models/ugc-featured-status';
import { UgcType } from '@models/ugc-filters';
import { createMockSunriseService, SunriseService } from '@services/sunrise';
import { PipesModule } from '@shared/pipes/pipes.module';
import { DateTime, Duration } from 'luxon';
import { of } from 'rxjs';
import { SunrisesetUgcfeatureStatusModalComponent } from './sunrise-feature-ugc-modal.component';

describe('SunrisesetUgcfeatureStatusModalComponent', () => {
  const model: PlayerUgcItem = fakePlayerUgcItem();

  let fixture: ComponentFixture<SunrisesetUgcfeatureStatusModalComponent>;
  let component: SunrisesetUgcfeatureStatusModalComponent;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockMatDialogRef: any;
  let mockSunriseService: SunriseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SunrisesetUgcfeatureStatusModalComponent],
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

    fixture = TestBed.createComponent(SunrisesetUgcfeatureStatusModalComponent);
    component = fixture.componentInstance;
    mockSunriseService = TestBed.inject(SunriseService);

    fixture.detectChanges();

    mockMatDialogRef = TestBed.inject(MatDialogRef);
    mockMatDialogRef.close = jasmine.createSpy('close');
    mockMatDialogRef.beforeClosed = jasmine.createSpy('beforeClosed').and.returnValue(of());

    mockSunriseService.getPlayerUgcItem$ = jasmine
      .createSpy('getPlayerUgcItem$')
      .and.returnValue(of(null));
    mockSunriseService.setUgcItemFeatureStatus = jasmine
      .createSpy('setUgcItemFeatureStatus')
      .and.returnValue(of());
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
        component.formControls.featuredDate.setValue(null);
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

    it('should call SunriseService.setUgcItemFeatureStatus() with correct params', () => {
      component.changeFeaturedStatus$(itemId, expireDate);

      expect(mockSunriseService.setUgcItemFeatureStatus).toHaveBeenCalledWith({
        itemId: itemId,
        isFeatured: true,
        expiry: expireDuration,
      } as UgcFeaturedStatus);
    });
  });

  describe('Method: deleteFeaturedStatus$', () => {
    const itemId = faker.datatype.uuid().toString();
    const expireDate = DateTime.local();
    expireDate.plus(1);

    it('should call SunriseService.setUgcItemFeatureStatus() with correct params', () => {
      component.deleteFeaturedStatus$(itemId);

      expect(mockSunriseService.setUgcItemFeatureStatus).toHaveBeenCalledWith({
        itemId: itemId,
        isFeatured: false,
      } as UgcFeaturedStatus);
    });
  });

  describe('Method: getUgcItem$', () => {
    const itemId = faker.datatype.uuid().toString();
    const type = UgcType.Livery;

    it('should call SunriseService.getPlayerUgcItem$() with correct params', () => {
      component.getUgcItem$(itemId, type);

      expect(mockSunriseService.getPlayerUgcItem$).toHaveBeenCalledWith(itemId, type);
    });
  });
});
