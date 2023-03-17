import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { createMockMsalServices } from '@mocks/msal.service.mock';
import { NgxsModule, Store } from '@ngxs/store';
import { createMockLoggerService } from '@services/logger/logger.service.mock';
import { HumanizePipe } from '@shared/pipes/humanize.pipe';
import { UserState } from '@shared/state/user/user.state';
import { LoyaltyRewardsFailedDialogComponent } from './loyalty-rewards-failed-dialog.component';

describe('LoyaltyRewardsFailedDialogComponent', () => {
  let component: LoyaltyRewardsFailedDialogComponent;
  let fixture: ComponentFixture<LoyaltyRewardsFailedDialogComponent>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockMatDialogRef: any;
  let mockStore: Store;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        NgxsModule.forRoot([UserState]),
      ],
      declarations: [LoyaltyRewardsFailedDialogComponent, HumanizePipe],
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

    fixture = TestBed.createComponent(LoyaltyRewardsFailedDialogComponent);
    component = fixture.debugElement.componentInstance;
    mockStore = TestBed.inject(Store);
    mockStore.dispatch = jasmine.createSpy('dispatch');
    mockMatDialogRef = TestBed.inject(MatDialogRef);
    mockMatDialogRef.close = jasmine.createSpy('close');
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
