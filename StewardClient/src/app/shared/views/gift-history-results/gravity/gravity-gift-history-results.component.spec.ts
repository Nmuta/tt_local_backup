import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { fakeBigNumber, faker } from '@interceptors/fake-api/utility';
import { IdentityResultBeta } from '@models/identity-query.model';
import { GravityService } from '@services/gravity';
import { createMockGravityService } from '@services/gravity/gravity.service.mock';
import { EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GravityGiftHistoryResultsComponent } from './gravity-gift-history-results.component';

describe('GravityGiftHistoryResultsComponent', () => {
  let component: GravityGiftHistoryResultsComponent;
  let fixture: ComponentFixture<GravityGiftHistoryResultsComponent>;
  let mockGravityService: GravityService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GravityGiftHistoryResultsComponent],
      providers: [createMockGravityService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GravityGiftHistoryResultsComponent);
    component = fixture.componentInstance;
    mockGravityService = TestBed.inject(GravityService);

    fixture.detectChanges();

    component.selectedPlayer = {
      query: null,
      gamertag: faker.random.word(),
      xuid: fakeBigNumber(),
      t10Id: faker.datatype.uuid(),
      error: null,
    } as IdentityResultBeta;
  });

  it(
    'should create',
    waitForAsync(() => {
      expect(component).toBeTruthy();
    }),
  );

  describe('Method: retrieveHistoryByPlayer', () => {
    beforeEach(() => {
      mockGravityService.getGiftHistoryByT10Id$ = jasmine.createSpy('getGiftHistoryByXuid$');
    });

    it('shoudl call GravityService.getGiftHistoryByXuid$()', () => {
      component.retrieveHistoryByPlayer$();

      expect(mockGravityService.getGiftHistoryByT10Id$).toHaveBeenCalled();
    });
  });

  describe('Method: retrieveHistoryByLspGroup', () => {
    it('should throw error', () => {
      const retrieveHistoryByLspGroup$ = component.retrieveHistoryByLspGroup$();

      retrieveHistoryByLspGroup$
        .pipe(
          catchError(_error => {
            expect(true).toBeTruthy();
            return EMPTY;
          }),
        )
        .subscribe(() => {
          expect(true).toBeFalsy();
        });
    });
  });
});
