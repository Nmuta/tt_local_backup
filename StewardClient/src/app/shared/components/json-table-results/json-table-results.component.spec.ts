import { NO_ERRORS_SCHEMA, SimpleChanges } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { JsonTableResultsComponent } from './json-table-results.component';
import { JsonTableResult } from '@models/json-table-result';

describe('JsonTableResultsComponent', () => {
  let fixture: ComponentFixture<JsonTableResultsComponent>;
  let component: JsonTableResultsComponent;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule.withRoutes([]),
          HttpClientTestingModule,
          NgxsModule.forRoot(),
        ],
        declarations: [JsonTableResultsComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [],
      }).compileComponents();

      fixture = TestBed.createComponent(JsonTableResultsComponent);
      component = fixture.debugElement.componentInstance;
    }),
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: ngOnChanges', () => {
    const testResults = [
      { foo: 'bar', cat: 'dog', showErrorInTable: false },
      { foo: 'bar2', cat: 'dog2', showErrorInTable: true },
    ] as JsonTableResult<never>[];

    beforeEach(() => {
      component.results = testResults;
    });

    describe('When simple changes does not include results', () => {
      const changes: SimpleChanges = {
        notResults: {
          previousValue: {},
          currentValue: [],
          firstChange: true,
          isFirstChange: () => true,
        },
      };

      it('Should reset the component results', () => {
        component.ngOnChanges(changes);

        expect(component.resultKeys).not.toBeUndefined();
        expect(component.downloadResults).not.toBeUndefined();
        expect(component.resultKeys.length).toEqual(0);
        expect(component.downloadResults.length).toEqual(0);
      });
    });

    describe('When simple changes include results with length of 0', () => {
      const changes: SimpleChanges = {
        results: {
          previousValue: {},
          currentValue: [],
          firstChange: true,
          isFirstChange: () => true,
        },
      };

      beforeEach(() => {
        component.results = [];
      });

      it('Should reset the component results', () => {
        component.ngOnChanges(changes);

        expect(component.resultKeys).not.toBeUndefined();
        expect(component.downloadResults).not.toBeUndefined();
        expect(component.resultKeys.length).toEqual(0);
        expect(component.downloadResults.length).toEqual(0);
      });
    });

    describe('When simple changes include results with length greater than 0', () => {
      const changes: SimpleChanges = {
        results: {
          previousValue: {},
          currentValue: [],
          firstChange: true,
          isFirstChange: () => true,
        },
      };

      beforeEach(() => {
        component.results = testResults;
      });

      it('Should set the component variables to display results correctly', () => {
        component.ngOnChanges(changes);

        expect(component.resultKeys).not.toBeUndefined();
        expect(component.downloadResults).not.toBeUndefined();

        expect(component.resultKeys.length).toEqual(2);
        expect(component.resultKeys[0]).toEqual('foo');
        expect(component.resultKeys[1]).toEqual('cat');

        expect(component.downloadResults.length).toEqual(3);
      });
    });
  });
});
