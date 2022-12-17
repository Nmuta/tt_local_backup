import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { createMockMsalServices } from '@mocks/msal.service.mock';
import { GameTitle } from '@models/enums';
import { NgxsModule } from '@ngxs/store';
import { createMockLoggerService } from '@services/logger/logger.service.mock';
import { UserSettingsState } from '@shared/state/user-settings/user-settings.state';
import { UserState } from '@shared/state/user/user.state';
import { PermAttribute, PermAttributeName } from './perm-attributes';

import { PermAttributesService } from './perm-attributes.service';

describe('PermAttributesService', () => {
  let service: PermAttributesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        NgxsModule.forRoot([UserState, UserSettingsState]),
        MatSnackBarModule,
      ],
      providers: [createMockMsalServices(), createMockLoggerService()],
      schemas: [NO_ERRORS_SCHEMA],
    });

    const injector = getTestBed();
    service = injector.inject(PermAttributesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Method: initialize', () => {
    const pemrs: PermAttribute[] = [
      {
        attribute: PermAttributeName.GiftPlayer,
        title: GameTitle.FH5,
        environment: 'Retail',
      },
      {
        attribute: PermAttributeName.GiftPlayer,
        title: GameTitle.FH5,
        environment: 'Studio',
      },
      {
        attribute: PermAttributeName.GiftPlayer,
        title: GameTitle.FH4,
        environment: 'Retail',
      },
    ];

    beforeEach(() => {
      Object.defineProperty(service, 'isUsingV1Auth', {
        get() {
          return false;
        },
      });

      service.initialize(pemrs);
    });

    it('should set availableTitlesAndEnvironments correctly', () => {
      expect(service.hasSteelheadAccess).toBeFalsy();
      expect(service.hasApolloAccess).toBeFalsy();
      expect(service.hasWoodstockAccess).toBeTruthy();
      expect(service.hasSunriseAccess).toBeTruthy();

      expect(service.steelheadEnvironments).toEqual([]);
      expect(service.apolloEnvironments).toEqual([]);
      expect(service.woodstockEnvironments).toEqual(['Retail', 'Studio']);
      expect(service.sunriseEnvironments).toEqual(['Retail']);
    });
  });
});
