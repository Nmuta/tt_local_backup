import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatLegacyDialogRef as MatDialogRef,
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
} from '@angular/material/legacy-dialog';
import { RouterTestingModule } from '@angular/router/testing';
import faker from '@faker-js/faker';
import { createMockMsalServices } from '@mocks/msal.service.mock';
import { PlayerUgcItem } from '@models/player-ugc-item';
import { NgxsModule, Store } from '@ngxs/store';
import { createMockLoggerService } from '@services/logger/logger.service.mock';
import { HumanizePipe } from '@shared/pipes/humanize.pipe';
import { UserState } from '@shared/state/user/user.state';
import { of } from 'rxjs';
import { PersistUgcModalComponent } from './persist-ugc-modal.component';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe(
'PersistUgcModalComponent', () => {
  let component: PersistUgcModalComponent;
  let fixture: ComponentFixture<PersistUgcModalComponent>;
  let mockStore: Store;

  beforeEach(async () => {
    TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        imports: [
          RouterTestingModule.withRoutes([]),
          HttpClientTestingModule,
          NgxsModule.forRoot([UserState]),
        ],
        declarations: [PersistUgcModalComponent, HumanizePipe],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [
          ...createMockMsalServices(),
          createMockLoggerService(),
          {
            provide: MatDialogRef,
            useValue: { close: () => null, beforeClosed: () => of() },
          },
          {
            provide: MAT_DIALOG_DATA,
            useValue: { id: faker.datatype.uuid() } as PlayerUgcItem,
          },
        ],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(PersistUgcModalComponent);
    component = fixture.debugElement.componentInstance;
    mockStore = TestBed.inject(Store);
    mockStore.dispatch = jasmine.createSpy('dispatch');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
