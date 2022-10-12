import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, getTestBed, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SunriseMakeModelAutocompleteComponent } from './sunrise-make-model-autocomplete.component';
import { SunriseSimpleCarsFakeApi } from '@interceptors/fake-api/apis/title/sunrise/kusto/cars';
import { uniqBy } from 'lodash';
import { SimpleCar } from '@models/cars';
import faker from '@faker-js/faker';

describe('SunriseMakeModelAutocompleteComponent', () => {
  let fixture: ComponentFixture<SunriseMakeModelAutocompleteComponent>;
  let component: SunriseMakeModelAutocompleteComponent;

  // const formBuilder: FormBuilder = new FormBuilder();
  let mockStore: Store;
  let fakeSimpleCars: SimpleCar[];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        NgxsModule.forRoot(),
        ReactiveFormsModule,
        MatAutocompleteModule,
      ],
      declarations: [SunriseMakeModelAutocompleteComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [],
    }).compileComponents();

    const injector = getTestBed();
    mockStore = injector.inject(Store);

    fixture = TestBed.createComponent(SunriseMakeModelAutocompleteComponent);
    component = fixture.debugElement.componentInstance;

    mockStore.select = jasmine.createSpy('select').and.returnValue(of([]));
    mockStore.dispatch = jasmine.createSpy('dispatch').and.returnValue(of({}));
    component.changes.emit = jasmine.createSpy('changes.emit');

    fakeSimpleCars = SunriseSimpleCarsFakeApi.make();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: ngOnInit', () => {
    beforeEach(() => {
      component.getSimpleCars$ = jasmine
        .createSpy('getSimpleCars$')
        .and.returnValue(of(fakeSimpleCars));
      component.getMonitor.monitorSingleFire = jasmine.createSpy('monitorSingleFire');
    });

    it('Should call getSimpleCars$', () => {
      component.ngOnInit();

      expect(component.getSimpleCars$).toHaveBeenCalled();
    });

    it('Should set makeModelFilterGroups', () => {
      component.ngOnInit();

      const expectedNumberOfCars = fakeSimpleCars.length;
      const expectedNumberOfCarMakes = uniqBy(fakeSimpleCars, car => car.makeId).length;
      expect(component.makeModelFilterGroups.length).toEqual(2);
      expect(component.makeModelFilterGroups[0].category).toEqual('Make');
      expect(component.makeModelFilterGroups[0].items.length).toEqual(expectedNumberOfCarMakes);
      expect(component.makeModelFilterGroups[1].category).toEqual('Model');
      expect(component.makeModelFilterGroups[1].items.length).toEqual(expectedNumberOfCars);
    });
  });

  describe('Method: writeValue', () => {
    beforeEach(() => {
      component.formControls.makeModelInput.patchValue = jasmine.createSpy('patchValue');
    });

    describe('When input is null', () => {
      it('should not patch value to form control', () => {
        component.writeValue(null);

        expect(component.formControls.makeModelInput.patchValue).not.toHaveBeenCalled();
      });
    });

    describe('When input is Kusto car', () => {
      it('should patch value to form control', () => {
        const carInput = fakeSimpleCars[0];
        component.writeValue(carInput);

        expect(component.formControls.makeModelInput.patchValue).toHaveBeenCalledWith(carInput, {
          emitEvent: false,
        });
      });
    });
  });

  describe('Method: itemAutoCompleteDisplayFn', () => {
    describe('When input is null', () => {
      it('should return empty string', () => {
        const res = component.itemAutoCompleteDisplayFn(null);

        expect(res).toEqual('');
      });
    });

    describe('When input is a string', () => {
      it('should return input string', () => {
        const input = faker.datatype.string();
        const res = component.itemAutoCompleteDisplayFn(input);

        expect(res).toEqual(input);
      });
    });
  });

  describe('Method: emitMakeModelChangeEvent', () => {
    describe('When makeModelInput is empty string', () => {
      it('should call changes.emit with null', () => {
        component.formControls.makeModelInput.setValue('');
        component.emitMakeModelChangeEvent();

        expect(component.changes.emit).toHaveBeenCalledWith(null);
      });
    });

    describe('When makeModelInput is a Kusto car', () => {
      it('should call changes.emit with Kusto car', () => {
        const carInput = fakeSimpleCars[0];
        component.formControls.makeModelInput.setValue(carInput);
        component.emitMakeModelChangeEvent();

        expect(component.changes.emit).toHaveBeenCalledWith(carInput);
      });
    });
  });

  describe('Method: autoCompleteDisplayFn', () => {
    describe('When input is null', () => {
      it('should return empty string', () => {
        const res = component.autoCompleteDisplayFn(null);

        expect(res).toEqual('');
      });
    });

    describe('When input is a Kusto car with an id', () => {
      it('should return full car name (make + model + [carId])', () => {
        const carInput = fakeSimpleCars[0];
        const res = component.autoCompleteDisplayFn(carInput);

        expect(res).toEqual(`${carInput.make} ${carInput.model} [${carInput.id}]`);
      });
    });

    describe('When input is a Kusto car without an id', () => {
      it('should return only car make', () => {
        const carInput = fakeSimpleCars[0];
        carInput.makeOnly = true;
        const res = component.autoCompleteDisplayFn(carInput);

        expect(res).toEqual(`${carInput.make}`);
      });
    });
  });

  describe('Method: clearMakeModelInput', () => {
    beforeEach(() => {
      component.emitMakeModelChangeEvent = jasmine.createSpy('emitMakeModelChangeEvent');
      component.formControls.makeModelInput.setValue = jasmine.createSpy(
        'formControls.makeModelInput.setValue',
      );
    });

    it('should set makeModelInput to empty string', () => {
      component.clearMakeModelInput();

      expect(component.formControls.makeModelInput.setValue).toHaveBeenCalledWith('');
    });

    it('should call emitMakeModelChangeEvent', () => {
      component.clearMakeModelInput();

      expect(component.emitMakeModelChangeEvent).toHaveBeenCalled();
    });
  });
});
