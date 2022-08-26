import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import faker from '@faker-js/faker';
import { createMockMsalServices } from '@mocks/msal.service.mock';
import { GameTitle, UserRole } from '@models/enums';
import { UserModel } from '@models/user.model';
import { NgxsModule, Store } from '@ngxs/store';
import { createMockLoggerService } from '@services/logger/logger.service.mock';
import { UserState } from '@shared/state/user/user.state';
import BigNumber from 'bignumber.js';
import { of } from 'rxjs';
import {
  PlayerProfileManagementComponent,
  PlayerProfileManagementServiceContract,
} from './player-profile-management.component';

describe('PlayerProfileManagementComponent', () => {
  let component: PlayerProfileManagementComponent;
  let fixture: ComponentFixture<PlayerProfileManagementComponent>;
  let mockStore: Store;

  const mockTemplates = Array(10).map(() => faker.random.word());
  const mockService: PlayerProfileManagementServiceContract = {
    gameTitle: GameTitle.FM8,
    getPlayerProfileTemplates$: () => of(mockTemplates),
    savePlayerProfileTemplate$: () => of(null),
    loadTemplateToPlayerProfile$: () => of(faker.datatype.uuid()),
    resetPlayerProfile$: () => of(faker.datatype.uuid()),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlayerProfileManagementComponent],
      imports: [NgxsModule.forRoot([UserState]), HttpClientTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [createMockMsalServices(), createMockLoggerService()],
    }).compileComponents();

    fixture = TestBed.createComponent(PlayerProfileManagementComponent);
    component = fixture.componentInstance;
    component.xuid = new BigNumber(faker.datatype.number());
    component.externalProfileId = faker.datatype.uuid();
    component.service = mockService;
    mockStore = TestBed.inject(Store);

    mockStore.selectSnapshot = jasmine.createSpy('selectSnapshot').and.returnValue({
      emailAddress: faker.internet.email(),
      role: UserRole.LiveOpsAdmin,
      name: faker.random.word(),
      objectId: faker.datatype.uuid(),
    } as UserModel);
  });

  it('should create', waitForAsync(() => {
    expect(component).toBeTruthy();
  }));

  describe('Method: ngOnInit', () => {
    beforeEach(() => {
      mockService.getPlayerProfileTemplates$ = jasmine
        .createSpy('getPlayerProfileTemplates')
        .and.returnValue(of(mockTemplates));
    });

    it('Should set profileTemplates', () => {
      component.ngOnInit();

      expect(mockService.getPlayerProfileTemplates$).toHaveBeenCalledTimes(1);
      expect(component.profileTemplates).toEqual(mockTemplates);
    });
  });

  describe('Method: ngOnChanges', () => {
    describe('When service is null', () => {
      beforeEach(() => {
        component.service = null;
      });

      it('should throw error', () => {
        try {
          component.ngOnChanges();

          expect(false).toBeTruthy();
        } catch (e) {
          expect(true).toBeTruthy();
          expect(e.message).toEqual(
            'No service contract provided for PlayerProfileManagementComponent',
          );
        }
      });
    });

    describe('When service is provided', () => {
      // Provided by default in the test component
      it('should not throw error', () => {
        try {
          component.ngOnChanges();

          expect(true).toBeTruthy();
        } catch (e) {
          expect(e).toEqual(null);
          expect(false).toBeTruthy();
        }
      });
    });
  });

  describe('Method: saveProfileToTemplate', () => {
    beforeEach(() => {
      mockService.savePlayerProfileTemplate$ = jasmine
        .createSpy('savePlayerProfileTemplate')
        .and.returnValue(of(mockTemplates));
      component.saveFormGroup.reset = jasmine.createSpy('saveFormGroup.reset');

      // Make sure required params are defined
      component.hasAccessToTool = true;
      component.saveFormControls.template.setValue(faker.random.word());
      component.saveFormControls.verifyAction.setValue(true);
    });

    it('should call savePlayerProfileTemplate$', () => {
      component.saveProfileToTemplate();

      expect(mockService.savePlayerProfileTemplate$).toHaveBeenCalledTimes(1);
      expect(component.saveFormGroup.reset).toHaveBeenCalled();
    });
  });

  describe('Method: loadTemplateToProfile', () => {
    const mockExternalIdResponse = faker.datatype.uuid();

    beforeEach(() => {
      mockService.loadTemplateToPlayerProfile$ = jasmine
        .createSpy('loadPlayerProfileTemplate')
        .and.returnValue(of(mockExternalIdResponse));
      component.loadFormGroup.reset = jasmine.createSpy('loadFormGroup.reset');

      // Make sure required params are defined
      component.hasAccessToTool = true;
      component.loadFormControls.template.setValue(faker.random.word());
      component.loadFormControls.verifyAction.setValue(true);
    });

    it('should call loadPlayerProfileTemplate$', () => {
      component.loadTemplateToProfile();

      expect(mockService.loadTemplateToPlayerProfile$).toHaveBeenCalledTimes(1);
      expect(component.loadFormGroup.reset).toHaveBeenCalled();
    });
  });

  describe('Method: resetProfile', () => {
    const mockExternalIdResponse = faker.datatype.uuid();

    beforeEach(() => {
      mockService.resetPlayerProfile$ = jasmine
        .createSpy('resetPlayerProfile')
        .and.returnValue(of(mockExternalIdResponse));
      component.resetFormGroup.reset = jasmine.createSpy('resetFormGroup.reset');

      // Make sure required params are defined
      component.hasAccessToTool = true;
      component.resetFormControls.verifyAction.setValue(true);
    });

    it('should call resetPlayerProfile$', () => {
      component.resetProfile();

      expect(mockService.resetPlayerProfile$).toHaveBeenCalledTimes(1);
      expect(component.resetFormGroup.reset).toHaveBeenCalled();
    });
  });
});
