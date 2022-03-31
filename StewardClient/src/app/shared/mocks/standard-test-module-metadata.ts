import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestModuleMetadata } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule } from '@ngxs/store';
import { StateClass } from '@ngxs/store/internals';
import { createMockApolloService } from '@services/apollo';
import { createMockGravityService } from '@services/gravity';
import { createMockLoggerService } from '@services/logger/logger.service.mock';
import { createMockOpusService } from '@services/opus';
import { createMockSteelheadService } from '@services/steelhead';
import { createMockSunriseService } from '@services/sunrise';
import { createMockWindowService } from '@services/window';
import { createMockWoodstockService } from '@services/woodstock';
import { createMockZendeskService } from '@services/zendesk';
import { createMockNotificationsService } from '@shared/hubs/notifications.service.mock';
import { PipesModule } from '@shared/pipes/pipes.module';
import { UserSettingsState } from '@shared/state/user-settings/user-settings.state';
import { UserState } from '@shared/state/user/user.state';
import { uniq } from 'lodash';
import { MatSnackBarMock } from './mat-snack-bar.mock';
import { createMockMsalServices } from './msal.service.mock';

/* eslint-disable @typescript-eslint/no-explicit-any */

export interface StandardTestModuleMetadataConfiguration extends TestModuleMetadata {
  ngxsModules?: StateClass<any>[];
}

export function createStandardTestModuleMetadata(
  additions: StandardTestModuleMetadataConfiguration,
): TestModuleMetadata {
  const metadata: TestModuleMetadata = {
    imports: [
      RouterTestingModule.withRoutes([]),
      HttpClientTestingModule,
      NgxsModule.forRoot([UserState, UserSettingsState, ...uniq(additions.ngxsModules ?? [])]),
      PipesModule,
    ],
    declarations: additions.declarations ?? [],
    schemas: additions.schemas ?? [NO_ERRORS_SCHEMA],
    providers: [
      createMockWindowService(),
      ...createMockMsalServices(),
      createMockZendeskService(),
      createMockLoggerService(),
      createMockNotificationsService(),
      createMockSunriseService(),
      createMockGravityService(),
      createMockApolloService(),
      createMockOpusService(),
      createMockSteelheadService(),
      createMockWoodstockService(),
      { provide: MatSnackBar, useClass: MatSnackBarMock },
    ],
  };

  if (additions.providers) {
    metadata.providers.push(...additions.providers);
  }

  if (additions.imports) {
    metadata.imports.push(...additions.imports);
  }

  return metadata;
}
