import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormBuilder, UntypedFormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { RouterTestingModule } from '@angular/router/testing';
import { GameTitleCodeName } from '@models/enums';
import { KustoQuery } from '@models/kusto';
import { NgxsModule } from '@ngxs/store';
import { createMockKustoService, KustoService } from '@services/kusto';
import { of, throwError } from 'rxjs';
import faker from '@faker-js/faker';

import { KustoComponent } from './kusto.component';
import { JsonTableResult } from '@models/json-table-result';

describe('KustoComponent', () => {
  let component: KustoComponent;
  let fixture: ComponentFixture<KustoComponent>;

  let mockKustoService: KustoService;

  const formBuilder: UntypedFormBuilder = new UntypedFormBuilder();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        NgxsModule.forRoot([]),
        ReactiveFormsModule,
        MatAutocompleteModule,
      ],
      declarations: [KustoComponent],
      providers: [createMockKustoService(), { provide: UntypedFormBuilder, useValue: formBuilder }],
    }).compileComponents();

    fixture = TestBed.createComponent(KustoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    mockKustoService = TestBed.inject(KustoService);

    component.kustoQueryForm = formBuilder.group({
      queryInput: new UntypedFormControl('', Validators.required),
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: setQueryToInput', () => {
    const kustoQuery: KustoQuery = {
      id: faker.datatype.uuid(),
      name: 'Test Query Name',
      query: 'Test Query',
      title: GameTitleCodeName.FH4,
    };

    beforeEach(() => {
      component.kustoQueryForm = formBuilder.group({
        queryInput: new UntypedFormControl('', Validators.required),
      });
    });

    it('should set kusto query to the form query control', () => {
      component.setQueryToInput(kustoQuery);

      expect(component.kustoQueryForm.controls['queryInput'].value).toEqual(kustoQuery.query);
    });
  });

  describe('Method: runQuery', () => {
    const testResults = [
      { foo: 'bar', cat: 'dog', showErrorInTable: false },
      { foo: 'bar2', cat: 'dog2', showErrorInTable: true },
    ] as JsonTableResult<never>[];

    beforeEach(() => {
      mockKustoService.postRunKustoQuery$ = jasmine
        .createSpy('postRunKustoQuery')
        .and.returnValue(of(testResults));
    });

    describe('If is loading is true', () => {
      beforeEach(() => {
        component.isLoading = true;
      });

      it('should not call kustoService.postRunKustoQuery()', () => {
        component.runQuery();

        expect(mockKustoService.postRunKustoQuery$).not.toHaveBeenCalled();
      });
    });

    describe('If the query input value is empty string', () => {
      beforeEach(() => {
        component.isLoading = false;

        component.kustoQueryForm = formBuilder.group({
          queryInput: new UntypedFormControl('', Validators.required),
        });
      });

      it('should not call kustoService.postRunKustoQuery()', () => {
        component.runQuery();

        expect(mockKustoService.postRunKustoQuery$).not.toHaveBeenCalled();
      });
    });

    describe('When query input is valid', () => {
      const fakeQuery = 'fake query';

      beforeEach(() => {
        component.isLoading = false;

        component.kustoQueryForm = formBuilder.group({
          queryInput: new UntypedFormControl(fakeQuery, Validators.required),
        });
      });

      it('should call kustoService.postRunKustoQuery()', () => {
        component.runQuery();

        expect(mockKustoService.postRunKustoQuery$).toHaveBeenCalled();
      });

      describe('And postRunKustoQuery returns error', () => {
        const error = { message: 'test error' };

        beforeEach(() => {
          mockKustoService.postRunKustoQuery$ = jasmine
            .createSpy('postRunKustoQuery')
            .and.returnValue(throwError(error));
        });

        it('should set load error', () => {
          component.runQuery();

          expect(mockKustoService.postRunKustoQuery$).toHaveBeenCalled();
          expect(component.isLoading).toBeFalsy();
          expect(component.loadError).toEqual(error);
        });
      });

      describe('And postRunKustoQuery returns valid response', () => {
        beforeEach(() => {
          mockKustoService.postRunKustoQuery$ = jasmine
            .createSpy('postRunKustoQuery')
            .and.returnValue(of(testResults));
        });

        it('should set queryResponse in component', () => {
          component.runQuery();

          expect(mockKustoService.postRunKustoQuery$).toHaveBeenCalled();
          expect(component.isLoading).toBeFalsy();
          expect(component.loadError).toBeUndefined();
          expect(component.queryResponse).toEqual(testResults);
        });
      });
    });
  });

  describe('Method: clearInput', () => {
    beforeEach(() => {
      component.kustoQueryForm.reset = jasmine.createSpy('reset');
    });

    it('should call clearInput on the kusto form', () => {
      component.clearInput();

      expect(component.kustoQueryForm.reset).toHaveBeenCalled();
    });
  });
});
