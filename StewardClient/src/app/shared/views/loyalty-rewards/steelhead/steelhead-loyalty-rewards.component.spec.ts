import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { createMockMsalServices } from '@mocks/msal.service.mock';
import { NgxsModule, Store } from '@ngxs/store';
import { createMockLoggerService } from '@services/logger/logger.service.mock';
import { HumanizePipe } from '@shared/pipes/humanize.pipe';
import { UserState } from '@shared/state/user/user.state';
import { SteelheadLoyaltyRewardsComponent } from './steelhead-loyalty-rewards.component';

describe('SteelheadLoyaltyRewardsComponent', () => {
  let component: SteelheadLoyaltyRewardsComponent;
  let fixture: ComponentFixture<SteelheadLoyaltyRewardsComponent>;
  let mockStore: Store;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        NgxsModule.forRoot([UserState]),
        MatDialogModule,
      ],
      declarations: [SteelheadLoyaltyRewardsComponent, HumanizePipe],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        ...createMockMsalServices(),
        createMockLoggerService(),
        {
          provide: MatDialogRef,
          useValue: { close: () => null },
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: 'test',
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SteelheadLoyaltyRewardsComponent);
    component = fixture.debugElement.componentInstance;
    mockStore = TestBed.inject(Store);
    mockStore.dispatch = jasmine.createSpy('dispatch');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
