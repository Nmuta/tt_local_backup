import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { GiftingResultComponent } from './gifting-result.component';
import faker from '@faker-js/faker';
import { GiftIdentityAntecedent } from '@shared/constants';
import { StewardErrorCode } from '@models/enums';

describe('GiftingResultComponent', () => {
  let fixture: ComponentFixture<GiftingResultComponent>;
  let component: GiftingResultComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([]), HttpClientTestingModule, NgxsModule.forRoot()],
      declarations: [GiftingResultComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [],
    }).compileComponents();

    fixture = TestBed.createComponent(GiftingResultComponent);
    component = fixture.debugElement.componentInstance;
  }));

  const result1Id = faker.datatype.uuid().toString();
  const result2Id = faker.datatype.uuid().toString();
  const result2Error = { message: faker.random.words(5), code: StewardErrorCode.BadRequest };
  const result3Id = faker.datatype.uuid().toString();

  beforeEach(() => {
    component.giftingResult = [
      {
        playerOrLspGroup: result1Id,
        identityAntecedent: GiftIdentityAntecedent.T10Id,
        errors: undefined,
      },
      {
        playerOrLspGroup: result2Id,
        identityAntecedent: GiftIdentityAntecedent.T10Id,
        errors: [result2Error],
      },
      {
        playerOrLspGroup: result3Id,
        identityAntecedent: GiftIdentityAntecedent.T10Id,
        errors: undefined,
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
      component.ngOnChanges();

      expect(component.giftingResult).not.toBeNull();
      expect(component.giftingResult.length).toEqual(3);
      expect(component.giftingResult[0].playerOrLspGroup).toEqual(result2Id);
    });

    it('should set giftingErrorCount with number of error results', () => {
      component.ngOnChanges();

      expect(component.playersWithErrorsCount).toEqual(1);
    });

    it('should call buildCsvData', () => {
      component.ngOnChanges();

      expect(component.buildCsvData).toHaveBeenCalled();
    });
  });

  describe('Method: buildCsvData', () => {
    it('should set giftingCsvData', () => {
      component.ngOnChanges();
      component.buildCsvData();

      // Verify column headers
      expect(component.giftingCsvData[0].length).toEqual(3);
      expect(component.giftingCsvData[0][0]).toEqual('PlayerOrLspGroup');
      expect(component.giftingCsvData[0][1]).toEqual('IdentityType');
      expect(component.giftingCsvData[0][2]).toEqual('Error');

      // Verify row ID
      expect(component.giftingCsvData[1][0]).toEqual(`'${result2Id}`);
    });
  });
});
