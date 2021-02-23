import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { GiftingResultComponent } from './gifting-result.component';
import faker from 'faker';
import { GiftHistoryAntecedent } from '@shared/constants';

describe('GiftingResultComponent', () => {
  let fixture: ComponentFixture<GiftingResultComponent>;
  let component: GiftingResultComponent;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule.withRoutes([]),
          HttpClientTestingModule,
          NgxsModule.forRoot(),
        ],
        declarations: [GiftingResultComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [],
      }).compileComponents();

      fixture = TestBed.createComponent(GiftingResultComponent);
      component = fixture.debugElement.componentInstance;
    }),
  );

  const result1Id = faker.random.uuid().toString();
  const result2Id = faker.random.uuid().toString();
  const result2Error = { message: faker.random.words(5) };
  const result3Id = faker.random.uuid().toString();

  beforeEach(() => {
    component.giftingResult = [
      {
        playerOrLspGroup: result1Id,
        identityAntecedent: GiftHistoryAntecedent.T10Id,
        error: undefined,
      },
      {
        playerOrLspGroup: result2Id,
        identityAntecedent: GiftHistoryAntecedent.T10Id,
        error: result2Error,
      },
      {
        playerOrLspGroup: result3Id,
        identityAntecedent: GiftHistoryAntecedent.T10Id,
        error: undefined,
      },
    ];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: ngOnInit', () => {
    beforeEach(() => {
      component.buildCsvData = jasmine.createSpy('buildCsvData');
    });

    it('should sort results with errors to the top of the list', () => {
      component.ngOnInit();

      expect(component.giftingResult).not.toBeNull();
      expect(component.giftingResult.length).toEqual(3);
      expect(component.giftingResult[0].playerOrLspGroup).toEqual(result2Id);
      expect(component.giftingResult[1].playerOrLspGroup).toEqual(result1Id);
      expect(component.giftingResult[2].playerOrLspGroup).toEqual(result3Id);
    });

    it('should set giftingErrorCount with number of error results', () => {
      component.ngOnInit();

      expect(component.giftingErrorCount).toEqual(1);
    });

    it('should call buildCsvData', () => {
      component.ngOnInit();

      expect(component.buildCsvData).toHaveBeenCalled();
    });
  });

  describe('Method: buildCsvData', () => {
    it('should set giftingCsvData', () => {
      component.ngOnInit();
      component.buildCsvData();

      // Verify column headers
      expect(component.giftingCsvData[0].length).toEqual(3);
      expect(component.giftingCsvData[0][0]).toEqual('PlayerOrLspGroup');
      expect(component.giftingCsvData[0][1]).toEqual('IdentityType');
      expect(component.giftingCsvData[0][2]).toEqual('Error');

      // Verify row ID
      expect(component.giftingCsvData[1][0]).toEqual(`'${result2Id}`);
      expect(component.giftingCsvData[2][0]).toEqual(`'${result1Id}`);
      expect(component.giftingCsvData[3][0]).toEqual(`'${result3Id}`);
    });
  });
});
