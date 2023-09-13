import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { createMockWoodstockService } from '@services/woodstock/woodstock.service.mock';
import { WoodstockBackstagePassHistoryComponent } from './woodstock-backstage-pass-history.component';
import { first } from 'lodash';
import { WoodstockPlayersIdentitiesFakeApi } from '@interceptors/fake-api/apis/title/woodstock/players/identities';
import { fakeXuid } from '@interceptors/fake-api/utility';
import { HumanizePipe } from '@shared/pipes/humanize.pipe';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe(
'WoodstockBackstagePassHistoryComponent', () => {
  let component: WoodstockBackstagePassHistoryComponent;
  let fixture: ComponentFixture<WoodstockBackstagePassHistoryComponent>;

  const testXuid = fakeXuid();

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        declarations: [WoodstockBackstagePassHistoryComponent, HumanizePipe],
        providers: [createMockWoodstockService()],
        schemas: [NO_ERRORS_SCHEMA],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WoodstockBackstagePassHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    component.getBackstagePassHistory$.next = jasmine
      .createSpy('getBackstagePassHistory$.next')
      .and.callThrough();
  });

  it('should create', waitForAsync(() => {
    expect(component).toBeTruthy();
  }));

  describe('Method: ngOnInit', () => {
    beforeEach(() => {
      component.getBackstagePassHistory$.next = jasmine
        .createSpy('getBackstagePassHistory$.next')
        .and.callThrough();
    });

    describe('When there is a valid identity in the component', () => {
      beforeEach(() => {
        component.identity = first(WoodstockPlayersIdentitiesFakeApi.make([{ xuid: testXuid }]));
      });

      it('should call getBackstagePassHistory$.next()', () => {
        component.ngOnInit();

        expect(component.getBackstagePassHistory$.next).toHaveBeenCalled();
      });
    });

    describe('When there is not a valid identity in the component', () => {
      beforeEach(() => {
        component.identity = undefined;
      });

      it('should not call getBackstagePassHistory$.next()', () => {
        component.ngOnInit();

        expect(component.getBackstagePassHistory$.next).not.toHaveBeenCalled();
      });
    });
  });

  describe('Method: ngOnChanges', () => {
    beforeEach(() => {
      component.getBackstagePassHistory$.next = jasmine.createSpy('getBackstagePassHistory$.next');
    });

    describe('When there is a valid identity in the component', () => {
      beforeEach(() => {
        component.identity = first(WoodstockPlayersIdentitiesFakeApi.make([{ xuid: testXuid }]));
      });

      it('should call getBackstagePassHistory$.next()', () => {
        component.ngOnChanges();

        expect(component.getBackstagePassHistory$.next).toHaveBeenCalled();
      });
    });

    describe('When there is not a valid identity in the component', () => {
      beforeEach(() => {
        component.identity = undefined;
      });

      it('should not call getBackstagePassHistory$.next()', () => {
        component.ngOnChanges();

        expect(component.getBackstagePassHistory$.next).not.toHaveBeenCalled();
      });
    });
  });
});
