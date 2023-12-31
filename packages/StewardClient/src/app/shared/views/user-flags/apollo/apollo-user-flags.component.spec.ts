import BigNumber from 'bignumber.js';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ApolloService, createMockApolloService } from '@services/apollo';
import { of, throwError } from 'rxjs';
import { ApolloUserFlagsComponent } from './apollo-user-flags.component';
import faker from '@faker-js/faker';
import { ApolloUserFlags } from '@models/apollo';
import { createMockOldPermissionsService, OldPermissionsService } from '@services/old-permissions';
import { PipesModule } from '@shared/pipes/pipes.module';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe('ApolloUserFlagsComponent', () => {
  let component: ApolloUserFlagsComponent;
  let fixture: ComponentFixture<ApolloUserFlagsComponent>;

  let mockApolloService: ApolloService;
  let mockPermissionsService: OldPermissionsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        declarations: [ApolloUserFlagsComponent],
        imports: [PipesModule],
        providers: [createMockApolloService(), createMockOldPermissionsService()],
        schemas: [NO_ERRORS_SCHEMA],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApolloUserFlagsComponent);
    component = fixture.componentInstance;
    mockApolloService = TestBed.inject(ApolloService);
    mockPermissionsService = TestBed.inject(OldPermissionsService);

    mockPermissionsService.currentUserHasWritePermission = jasmine
      .createSpy('currentUserHasWritePermission ')
      .and.returnValue(true);
    fixture.detectChanges();
  });

  it('should create', waitForAsync(() => {
    expect(component).toBeTruthy();
  }));

  describe('Method: ngOnChanges', () => {
    beforeEach(() => {
      component.getFlagsByXuid$ = jasmine.createSpy('getFlagsByXuid$').and.returnValue(of({}));
    });

    describe('When identity is undefined', () => {
      beforeEach(() => {
        component.identity = undefined;
      });

      it('should not call getFlagsByXuid$', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        component.ngOnChanges(<any>{});

        expect(component.getFlagsByXuid$).not.toHaveBeenCalledTimes(1);
      });
    });

    describe('When identity is defined', () => {
      beforeEach(() => {
        component.identity = {
          query: undefined,
          gamertag: faker.name.firstName(),
          xuid: new BigNumber(faker.datatype.number({ min: 10_000, max: 500_000 })),
        };
      });

      it('should call getFlagsByXuid$', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        component.ngOnChanges(<any>{});

        expect(component.getFlagsByXuid$).toHaveBeenCalledTimes(1);
      });

      describe('And getFlagsByXuid$ return valid response', () => {
        const flags = {
          isVip: faker.datatype.boolean(),
          isTurn10Employee: faker.datatype.boolean(),
          isEarlyAccess: faker.datatype.boolean(),
          isUnderReview: faker.datatype.boolean(),
        } as ApolloUserFlags;

        beforeEach(() => {
          component.getFlagsByXuid$ = jasmine
            .createSpy('getFlagsByXuid$')
            .and.returnValue(of(flags));
        });

        it('should set currentFlags', () => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          component.ngOnChanges(<any>{});

          expect(component.currentFlags).toEqual(flags);
          expect(component.formControls.isVip.value).toEqual(flags.isVip);
          expect(component.formControls.isTurn10Employee.value).toEqual(flags.isTurn10Employee);
          expect(component.formControls.isEarlyAccess.value).toEqual(flags.isEarlyAccess);
          expect(component.formControls.isUnderReview.value).toEqual(flags.isUnderReview);
        });
      });

      describe('And getFlagsByXuid$ return error', () => {
        const error = { message: 'test error' };

        beforeEach(() => {
          component.getFlagsByXuid$ = jasmine
            .createSpy('getFlagsByXuid$')
            .and.returnValue(throwError(error));
        });

        it('should set error', () => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          component.ngOnChanges(<any>{});

          expect(component.currentFlags).toBeUndefined();
          expect(component.getFlagsActionMonitor.status.error).toEqual(error);
        });
      });
    });
  });

  describe('Method: getFlagsByXuid$', () => {
    beforeEach(() => {
      component.identity = {
        query: undefined,
        gamertag: faker.name.firstName(),
        xuid: new BigNumber(faker.datatype.number({ min: 10_000, max: 500_000 })),
      };
      mockApolloService.getFlagsByXuid$ = jasmine
        .createSpy('getFlagsByXuid$')
        .and.returnValue(of({}));
    });

    it('should call sunriseService.getSharedConsoleUsersByXuid', () => {
      const expectedXuid = component.identity.xuid;
      component.getFlagsByXuid$(component.identity.xuid);

      expect(mockApolloService.getFlagsByXuid$).toHaveBeenCalledTimes(1);
      expect(mockApolloService.getFlagsByXuid$).toHaveBeenCalledWith(expectedXuid);
    });
  });
});
