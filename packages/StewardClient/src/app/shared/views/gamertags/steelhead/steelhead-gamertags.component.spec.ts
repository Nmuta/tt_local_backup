import BigNumber from 'bignumber.js';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { SteelheadGamertagsComponent } from './steelhead-gamertags.component';
import faker from '@faker-js/faker';
import { SteelheadSharedConsoleUser } from '@models/steelhead';
import { ActivatedRoute } from '@angular/router';
import { SteelheadPlayerConsolesService } from '@services/api-v2/steelhead/player/consoles/steelhead-player-consoles.service';
import { createMockSteelheadPlayerConsolesService } from '@services/api-v2/steelhead/player/consoles/steelhead-player-consoles.service.mock';
import { HumanizePipe } from '@shared/pipes/humanize.pipe';

const activatedRouteMock = {
  pathFromRoot: [
    {
      snapshot: { url: [{ path: 'tools' }] },
    } as ActivatedRoute,
  ] as ActivatedRoute[],
};

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe('SteelheadGamertagsComponent', () => {
  let component: SteelheadGamertagsComponent;
  let fixture: ComponentFixture<SteelheadGamertagsComponent>;

  let mockSteelheadService: SteelheadPlayerConsolesService;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        declarations: [SteelheadGamertagsComponent, HumanizePipe],
        providers: [
          createMockSteelheadPlayerConsolesService(),
          {
            provide: ActivatedRoute,
            useValue: activatedRouteMock,
          },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SteelheadGamertagsComponent);
    component = fixture.componentInstance;
    mockSteelheadService = TestBed.inject(SteelheadPlayerConsolesService);
    fixture.detectChanges();
  });

  it('should create', waitForAsync(() => {
    expect(component).toBeTruthy();
  }));

  describe('Method: ngOnChanges', () => {
    beforeEach(() => {
      component.getSharedConsoleUsersByXuid$ = jasmine
        .createSpy('getSharedConsoleUsersByXuid$')
        .and.returnValue(of({}));
    });

    describe('When identity is undefined', () => {
      beforeEach(() => {
        component.identity = undefined;
      });

      it('should not call getSharedConsoleUsersByXuid$', () => {
        component.ngOnChanges();

        expect(component.getSharedConsoleUsersByXuid$).not.toHaveBeenCalledTimes(1);
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

      it('should call getSharedConsoleUsersByXuid$', () => {
        component.ngOnChanges();

        expect(component.getSharedConsoleUsersByXuid$).toHaveBeenCalledTimes(1);
      });

      describe('And getSharedConsoleUsersByXuid$ return valid response', () => {
        const relatedGamertags = [
          {
            sharedConsoleId: new BigNumber(faker.datatype.number()),
            xuid: new BigNumber(faker.datatype.number()),
            gamertag: faker.random.word(),
            everBanned: faker.datatype.boolean(),
          },
        ] as SteelheadSharedConsoleUser[];

        beforeEach(() => {
          component.getSharedConsoleUsersByXuid$ = jasmine
            .createSpy('getSharedConsoleUsersByXuid$')
            .and.returnValue(of(relatedGamertags));
        });

        it('should set sharedConsoleUsers', () => {
          component.ngOnChanges();

          expect(component.sharedConsoleUsers).toEqual(relatedGamertags);
        });
      });

      describe('And getSharedConsoleUsersByXuid$ return error', () => {
        const error = { message: 'test error' };

        beforeEach(() => {
          component.getSharedConsoleUsersByXuid$ = jasmine
            .createSpy('getSharedConsoleUsersByXuid$')
            .and.returnValue(throwError(error));
        });

        it('should set error', () => {
          component.ngOnChanges();

          expect(component.sharedConsoleUsers).toBeUndefined();
          expect(component.getMonitor?.status?.error).toEqual(error);
        });
      });
    });
  });

  describe('Method: getSharedConsoleUsersByXuid$', () => {
    beforeEach(() => {
      component.identity = {
        query: undefined,
        gamertag: faker.name.firstName(),
        xuid: new BigNumber(faker.datatype.number({ min: 10_000, max: 500_000 })),
      };
      mockSteelheadService.getSharedConsoleUsersByXuid$ = jasmine
        .createSpy('getSharedConsoleUsersByXuid$')
        .and.returnValue(of({}));
    });

    it('should call sunriseService.getSharedConsoleUsersByXuid$', () => {
      const expectedXuid = component.identity.xuid;
      component.getSharedConsoleUsersByXuid$(component.identity.xuid);

      expect(mockSteelheadService.getSharedConsoleUsersByXuid$).toHaveBeenCalledTimes(1);
      expect(mockSteelheadService.getSharedConsoleUsersByXuid$).toHaveBeenCalledWith(expectedXuid);
    });
  });
});
