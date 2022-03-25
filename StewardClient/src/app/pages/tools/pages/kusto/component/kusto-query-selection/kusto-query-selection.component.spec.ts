import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormBuilder, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { KustoQueryGroup, KustoQuerySelectionComponent } from './kusto-query-selection.component';
import faker from '@faker-js/faker';
import { KustoQuery } from '@models/kusto';
import { GameTitleCodeName } from '@models/enums';
import { createMockKustoService, KustoService } from '@services/kusto';
import { of, throwError } from 'rxjs';

describe('KustoQuerySelectionComponent', () => {
  let fixture: ComponentFixture<KustoQuerySelectionComponent>;
  let component: KustoQuerySelectionComponent;

  const formBuilder: FormBuilder = new FormBuilder();
  let mockKustoService: KustoService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        NgxsModule.forRoot(),
        ReactiveFormsModule,
        MatAutocompleteModule,
      ],
      declarations: [KustoQuerySelectionComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{ provide: FormBuilder, useValue: formBuilder }, createMockKustoService()],
    }).compileComponents();

    fixture = TestBed.createComponent(KustoQuerySelectionComponent);
    component = fixture.debugElement.componentInstance;
    mockKustoService = TestBed.inject(KustoService);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: ngOnInit', () => {
    describe('When kustoService.getKustoQueries$() returns valid data', () => {
      const query: KustoQuery = {
        id: faker.datatype.uuid(),
        name: faker.random.word(),
        query: faker.random.word(),
        title: GameTitleCodeName.FH4,
      };

      const queryGroup = {
        category: faker.random.word(),
        items: [],
      };

      beforeEach(() => {
        mockKustoService.getKustoQueries$ = jasmine
          .createSpy('getKustoQueries$')
          .and.returnValue(of([query] as KustoQuery[]));
        component.buildMatAutocompleteState = jasmine
          .createSpy('buildMatAutocompleteState')
          .and.returnValue([queryGroup] as KustoQueryGroup[]);
      });

      it('should build dropdown properties', () => {
        component.ngOnInit();

        expect(component.buildMatAutocompleteState).toHaveBeenCalledWith([query]);
        expect(component.queryGroups).toEqual([queryGroup]);
      });
    });

    describe('When kustoService.getKustoQueries$() throws error', () => {
      const error = 'Test error';

      beforeEach(() => {
        mockKustoService.getKustoQueries$ = jasmine
          .createSpy('getKustoQueries$')
          .and.returnValue(throwError(error));
        component.querySelectionForm.markAllAsTouched = jasmine.createSpy(
          'querySelectionForm.markAllAsTouched',
        );
      });

      it('should handle error', () => {
        component.ngOnInit();

        expect(component.loadError).toEqual(error);
        expect(component.querySelectionForm.markAllAsTouched).toHaveBeenCalled();
      });
    });
  });

  describe('Method: addItemEmit', () => {
    const formGroupDirective = new FormGroupDirective([], []);
    beforeEach(() => {
      component.selectedKustoQueryEvent.emit = jasmine.createSpy('emit');
      component.querySelectionForm = formBuilder.group({});
    });

    describe('If there is no selected item', () => {
      beforeEach(() => {
        component.selectedItem = undefined;
      });

      it('should not emit addItemEvent', () => {
        component.selectedQueryEmitter(formGroupDirective);

        expect(component.selectedKustoQueryEvent.emit).not.toHaveBeenCalled();
      });
    });

    describe('If there is a selection item', () => {
      const testKustoQuery: KustoQuery = {
        id: faker.datatype.uuid(),
        name: faker.random.word(),
        query: faker.random.words(50),
        title: GameTitleCodeName.FH4,
      };
      beforeEach(() => {
        component.selectedItem = testKustoQuery;
        component.querySelectionForm.reset = jasmine.createSpy('reset');
        formGroupDirective.resetForm = jasmine.createSpy('reset');
      });

      it('should emit addItemEvent with correct quantity', () => {
        component.selectedQueryEmitter(formGroupDirective);

        expect(component.selectedKustoQueryEvent.emit).toHaveBeenCalledWith(testKustoQuery);
      });

      it('should set selectedItem undefined', () => {
        component.selectedQueryEmitter(formGroupDirective);

        expect(component.selectedItem).toBeUndefined();
      });

      it('should call itemSelectionForm reset', () => {
        component.selectedQueryEmitter(formGroupDirective);

        expect(component.querySelectionForm.reset).toHaveBeenCalled();
      });

      it('should call formGroupDirective.resetForm', () => {
        component.selectedQueryEmitter(formGroupDirective);

        expect(formGroupDirective.resetForm).toHaveBeenCalled();
      });
    });
  });

  describe('Method: newQuerySelected', () => {
    const testKustoQuery: KustoQuery = {
      id: faker.datatype.uuid(),
      name: faker.random.word(),
      query: faker.random.words(50),
      title: GameTitleCodeName.FH4,
    };
    beforeEach(() => {
      component.selectedItem = undefined;
    });

    it('should set selectedItem', () => {
      component.newQuerySelected(testKustoQuery);

      expect(component.selectedItem).toEqual(testKustoQuery);
    });
  });
});
