import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ApolloService, createMockApolloService } from '@services/apollo';
import { of, throwError } from 'rxjs';
import { ApolloUserFlagsComponent } from './apollo-user-flags.component';
import faker from 'faker';
import { ApolloUserFlags } from '@models/apollo';

describe('ApolloUserFlagsComponent', () => {
  let component: ApolloUserFlagsComponent;
  let fixture: ComponentFixture<ApolloUserFlagsComponent>;

  let mockApolloService: ApolloService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApolloUserFlagsComponent],
      providers: [createMockApolloService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApolloUserFlagsComponent);
    component = fixture.componentInstance;
    mockApolloService = TestBed.inject(ApolloService);
    fixture.detectChanges();
  });

  it(
    'should create',
    waitForAsync(() => {
      expect(component).toBeTruthy();
    }),
  );

  describe('Method: ngOnChanges', () => {
    beforeEach(() => {
      component.getFlagsByXuid = jasmine.createSpy('getFlagsByXuid').and.returnValue(of({}));
    });

    describe('When identity is undefined', () => {
      beforeEach(() => {
        component.identity = undefined;
      });

      it('should not call getFlagsByXuid', () => {
        component.ngOnChanges();

        expect(component.getFlagsByXuid).not.toHaveBeenCalledTimes(1);
      });
    });

    describe('When identity is defined', () => {
      beforeEach(() => {
        component.identity = {
          query: undefined,
          gamertag: faker.name.firstName(),
          xuid: BigInt(faker.random.number({ min: 10_000, max: 500_000 })),
        };
      });

      it('should call getFlagsByXuid', () => {
        component.ngOnChanges();

        expect(component.getFlagsByXuid).toHaveBeenCalledTimes(1);
      });

      describe('And getFlagsByXuid return valid response', () => {
        const flags = {
          isVip: faker.random.boolean(),
          isTurn10Employee: faker.random.boolean(),
          isCommunityManager: faker.random.boolean(),
          isEarlyAccess: faker.random.boolean(),
          isUnderReview: faker.random.boolean(),
        } as ApolloUserFlags;

        beforeEach(() => {
          component.getFlagsByXuid = jasmine.createSpy('getFlagsByXuid').and.returnValue(of(flags));
        });

        it('should set currentFlags', () => {
          component.ngOnChanges();

          expect(component.currentFlags).toEqual(flags);
          expect(component.flags).toEqual(flags);
        });
      });

      describe('And getFlagsByXuid return error', () => {
        const error = { message: 'test error' };

        beforeEach(() => {
          component.getFlagsByXuid = jasmine
            .createSpy('getFlagsByXuid')
            .and.returnValue(throwError(error));
        });

        it('should set error', () => {
          component.ngOnChanges();

          expect(component.currentFlags).toBeUndefined();
          expect(component.flags).toBeUndefined();
          expect(component.loadError).toEqual(error);
        });
      });
    });
  });

  describe('Method: getFlagsByXuid', () => {
    beforeEach(() => {
      component.identity = {
        query: undefined,
        gamertag: faker.name.firstName(),
        xuid: BigInt(faker.random.number({ min: 10_000, max: 500_000 })),
      };
      mockApolloService.getFlagsByXuid = jasmine
        .createSpy('getFlagsByXuid')
        .and.returnValue(of({}));
    });

    it('should call sunriseService.getSharedConsoleUsersByXuid', () => {
      const expectedXuid = component.identity.xuid;
      component.getFlagsByXuid(component.identity.xuid);

      expect(mockApolloService.getFlagsByXuid).toHaveBeenCalledTimes(1);
      expect(mockApolloService.getFlagsByXuid).toHaveBeenCalledWith(expectedXuid);
    });
  });
});
