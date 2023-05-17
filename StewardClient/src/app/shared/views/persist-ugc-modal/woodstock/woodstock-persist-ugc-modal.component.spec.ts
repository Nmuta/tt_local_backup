import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import faker from '@faker-js/faker';
import { createMockMsalServices } from '@mocks/msal.service.mock';
import { PlayerUgcItem } from '@models/player-ugc-item';
import { NgxsModule, Store } from '@ngxs/store';
import { createMockLoggerService } from '@services/logger/logger.service.mock';
import { UserState } from '@shared/state/user/user.state';
import { WoodstockPersistUgcModalComponent } from './woodstock-persist-ugc-modal.component';

describe('WoodstockPersistUgcModalComponent', () => {
  let component: WoodstockPersistUgcModalComponent;
  let fixture: ComponentFixture<WoodstockPersistUgcModalComponent>;
  let mockStore: Store;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        NgxsModule.forRoot([UserState]),
      ],
      declarations: [WoodstockPersistUgcModalComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        ...createMockMsalServices(),
        createMockLoggerService(),
        {
          provide: MAT_DIALOG_DATA,
          useValue: { id: faker.datatype.uuid() } as PlayerUgcItem,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WoodstockPersistUgcModalComponent);
    component = fixture.debugElement.componentInstance;
    mockStore = TestBed.inject(Store);
    mockStore.dispatch = jasmine.createSpy('dispatch');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
