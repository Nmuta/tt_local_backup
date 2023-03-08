import BigNumber from 'bignumber.js';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { WoodstockSharedConsoleUser } from '@models/woodstock';
import { WoodstockService } from '@services/woodstock';
import { createMockWoodstockService } from '@services/woodstock/woodstock.service.mock';
import faker from '@faker-js/faker';
import { of, throwError } from 'rxjs';
import { WoodstockGamertagsComponent } from './woodstock-gamertags.component';
import { ActivatedRoute } from '@angular/router';
import { HumanizePipe } from '@shared/pipes/humanize.pipe';

const activatedRouteMock = {
  pathFromRoot: [
    {
      snapshot: { url: [{ path: 'tools' }] },
    } as ActivatedRoute,
  ] as ActivatedRoute[],
};

describe('WoodstockGamertagsComponent', () => {
  let component: WoodstockGamertagsComponent;
  let fixture: ComponentFixture<WoodstockGamertagsComponent>;

  let mockWoodstockService: WoodstockService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WoodstockGamertagsComponent, HumanizePipe],
      providers: [
        createMockWoodstockService(),
        {
          provide: ActivatedRoute,
          useValue: activatedRouteMock,
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WoodstockGamertagsComponent);
    component = fixture.componentInstance;
    mockWoodstockService = TestBed.inject(WoodstockService);
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
        ] as WoodstockSharedConsoleUser[];

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

  describe('Method: getSharedConsoleUsersByXuid', () => {
    beforeEach(() => {
      component.identity = {
        query: undefined,
        gamertag: faker.name.firstName(),
        xuid: new BigNumber(faker.datatype.number({ min: 10_000, max: 500_000 })),
      };
      mockWoodstockService.getSharedConsoleUsersByXuid$ = jasmine
        .createSpy('getSharedConsoleUsersByXuid$')
        .and.returnValue(of({}));
    });

    it('should call woodstockService.getSharedConsoleUsersByXuid$', () => {
      const expectedXuid = component.identity.xuid;
      component.getSharedConsoleUsersByXuid$(component.identity.xuid);

      expect(mockWoodstockService.getSharedConsoleUsersByXuid$).toHaveBeenCalledTimes(1);
      expect(mockWoodstockService.getSharedConsoleUsersByXuid$).toHaveBeenCalledWith(expectedXuid);
    });
  });
});
