import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgxsModule, Store } from '@ngxs/store';
import { UserState } from '@shared/state/user/user.state';
import faker from 'faker';

import { DurationPickerComponent } from './duration-picker.component';
import { UserRole } from '@models/enums';
import { UserModel } from '@models/user.model';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { createMockMsalService } from '@mocks/msal.service.mock';
import { createMockLoggerService } from '@services/logger/logger.service.mock';
import { last } from 'lodash';

describe('DurationPickerComponent', () => {
  let component: DurationPickerComponent;
  let fixture: ComponentFixture<DurationPickerComponent>;

  let mockStore: Store;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          MatDatepickerModule,
          MatNativeDateModule,
          HttpClientTestingModule,
          NgxsModule.forRoot([UserState]),
        ],
        declarations: [DurationPickerComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [createMockMsalService(), createMockLoggerService()],
      }).compileComponents();

      fixture = TestBed.createComponent(DurationPickerComponent);
      component = fixture.debugElement.componentInstance;

      mockStore = TestBed.inject(Store);
      mockStore.selectSnapshot = jasmine.createSpy('selectSnapshot');
    }),
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: ngOnInit', () => {
    beforeEach(() => {
      component.options = [];
    });

    describe('If profile role is not LiveOpsAdmin', () => {
      beforeEach(() => {
        mockStore.selectSnapshot = jasmine.createSpy('selectSnapshot').and.returnValue({
          emailAddress: `${faker.name.firstName()}@microsofttest.fake`,
          role: UserRole.SupportAgent,
          name: faker.name.firstName(),
          liveOpsAdminSecondaryRole: undefined,
        } as UserModel);
      });

      it('should not set 1 minute duration options', () => {
        component.ngOnInit();

        expect(component.options.length).toEqual(3);
      });
    });

    describe('If profile role is LiveOpsAdmin', () => {
      beforeEach(() => {
        mockStore.selectSnapshot = jasmine.createSpy('selectSnapshot').and.returnValue({
          emailAddress: `${faker.name.firstName()}@microsofttest.fake`,
          role: UserRole.LiveOpsAdmin,
          name: faker.name.firstName(),
          liveOpsAdminSecondaryRole: undefined,
        } as UserModel);
      });

      it('should set 1 minute option duration options', () => {
        component.ngOnInit();

        expect(component.options.length).toEqual(4);
        expect(component.options[0].humanized).toEqual('1 minute');
      });
    });
  });

  describe('Form Control Contract', () => {
    let onChangeFunction: (data: unknown) => unknown;
    let onTouchedFunction: () => unknown;

    beforeEach(() => {
      onChangeFunction = jasmine.createSpy('onChangeFunction');
      onChangeFunction = jasmine.createSpy('onTouchFunction');
      component.registerOnChange(onChangeFunction);
      component.registerOnTouched(onTouchedFunction);
    });

    it('should not call onChange when writeValue(data) called', () => {
      component.writeValue(last(component.options).duration);
      expect(onChangeFunction).toHaveBeenCalledTimes(0);
    });

    it('should call onChange(data) when changed internally', () => {
      component.formControl.setValue(last(component.options).duration);
      expect(onChangeFunction).toHaveBeenCalledTimes(1);
    });

    it('setDisabledState(true)', () => {
      component.setDisabledState(true);
      expect(component.formControl.disabled).toBeTruthy();
    });

    it('setDisabledState(false)', () => {
      component.setDisabledState(false);
      expect(component.formControl.disabled).toBeFalsy();
    });
  });
});
