import BigNumber from 'bignumber.js';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import faker from '@faker-js/faker';
import { BanResultsComponent } from './ban-results.component';

describe('BanResultsComponent', () => {
  let fixture: ComponentFixture<BanResultsComponent>;
  let component: BanResultsComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([]), HttpClientTestingModule, NgxsModule.forRoot()],
      declarations: [BanResultsComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [],
    }).compileComponents();

    fixture = TestBed.createComponent(BanResultsComponent);
    component = fixture.debugElement.componentInstance;
  }));

  const result1Id = new BigNumber(faker.datatype.number());
  const result2Id = new BigNumber(faker.datatype.number());
  const result3Id = new BigNumber(faker.datatype.number());

  beforeEach(() => {
    component.banResults = [
      {
        xuid: result1Id,
        error: null,
        banDescription: undefined,
      },
      {
        xuid: result2Id,
        error: {
          code: 'ServicesFailure',
          message: 'LSP failed to ban player with XUID: ' + result2Id,
          innererror: null,
          target: null,
          details: null,
        },
        banDescription: undefined,
      },
      {
        xuid: result3Id,
        error: null,
        banDescription: undefined,
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

      expect(component.banResults).not.toBeNull();
      expect(component.banResults.length).toEqual(3);
      expect(component.banResults[0].xuid).toEqual(result2Id);
      expect(component.banResults[1].xuid).toEqual(result1Id);
      expect(component.banResults[2].xuid).toEqual(result3Id);
    });

    it('should set banErrorCount with number of error results', () => {
      component.ngOnInit();

      expect(component.banErrorCount).toEqual(1);
    });

    it('should call buildCsvData', () => {
      component.ngOnInit();

      expect(component.buildCsvData).toHaveBeenCalled();
    });
  });

  describe('Method: buildCsvData', () => {
    it('should set banCsvData', () => {
      component.ngOnInit();
      component.buildCsvData();

      // Verify column headers
      expect(component.banCsvData[0].length).toEqual(2);
      expect(component.banCsvData[0][0]).toEqual('Xuid');
      expect(component.banCsvData[0][1]).toEqual('Success');

      // Verify row ID
      expect(component.banCsvData[1][0]).toEqual(`'${result2Id}`);
      expect(component.banCsvData[2][0]).toEqual(`'${result1Id}`);
      expect(component.banCsvData[3][0]).toEqual(`'${result3Id}`);
    });
  });
});
