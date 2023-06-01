import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DeviceType, GameTitle } from '@models/enums';
import { NgxsModule } from '@ngxs/store';
import { Observable, of } from 'rxjs';
import {
  FormGroupNotificationEntry,
  LocalizedGroupMessagingManagementContract,
  LocalizedGroupNotificationManagementComponent,
} from './localized-group-notification-management.component';
import { fakeBigNumber } from '@interceptors/fake-api/utility';
import faker from '@faker-js/faker';
import { LocalizedGroupNotification } from '@models/notifications.model';
import BigNumber from 'bignumber.js';
import { SelectLocalizedStringContract } from '@components/localization/select-localized-string/select-localized-string.component';
import { LocalizedStringsMap } from '@models/localization';
import { LocalizedMessage } from '@models/community-message';
import { toDateTime } from '@helpers/luxon';

/** Test class for {@link LocalizedGroupMessagingManagementContract}. */
class TestNotificationManagementService implements LocalizedGroupMessagingManagementContract {
  public gameTitle: GameTitle.FH5;
  public selectLocalizedStringService: SelectLocalizedStringContract = {
    gameTitle: GameTitle.FH5,
    /** Get localized strings. */
    getLocalizedStrings$(): Observable<LocalizedStringsMap> {
      return of(null);
    },
  };
  /** Get group notifications. */
  public getGroupNotifications$(): Observable<LocalizedGroupNotification[]> {
    return of([]);
  }
  /** Edit group notification. */
  public postEditLspGroupCommunityMessage$(
    _lspGroupId: BigNumber,
    _notificationId: string,
    _communityMessage: LocalizedMessage,
  ): Observable<void> {
    return of();
  }
  /** Delete group notification. */
  public deleteLspGroupCommunityMessage$(
    _lspGroupId: BigNumber,
    _notificationId: string,
  ): Observable<void> {
    return of();
  }
}

describe('LocalizedGroupNotificationManagementComponent', () => {
  let component: LocalizedGroupNotificationManagementComponent;
  let fixture: ComponentFixture<LocalizedGroupNotificationManagementComponent>;
  let testGroupNotifications: LocalizedGroupNotification[];

  const mockService: TestNotificationManagementService = new TestNotificationManagementService();

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgxsModule.forRoot()],
      declarations: [LocalizedGroupNotificationManagementComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [TestNotificationManagementService],
    }).compileComponents();

    fixture = TestBed.createComponent(LocalizedGroupNotificationManagementComponent);
    component = fixture.debugElement.componentInstance;
    component.service = mockService;

    testGroupNotifications = new Array(faker.datatype.number({ min: 3, max: 10 }))
      .fill(undefined)
      .map(
        () =>
          <LocalizedGroupNotification>{
            message: faker.random.words(),
            notificationId: faker.datatype.uuid(),
            sentDateUtc: toDateTime(faker.date.soon()),
            expirationDateUtc: toDateTime(faker.date.soon()),
            hasDeviceType: faker.datatype.boolean(),
            deviceType: faker.random.arrayElement(Object.getOwnPropertyNames(DeviceType)),
            notificationType: 'CommunityMessageNotification',
            groupId: fakeBigNumber(),
          },
      );
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: retrieveNotifications', () => {
    beforeEach(() => {
      mockService.getGroupNotifications$ = jasmine
        .createSpy('getGroupNotifications$')
        .and.returnValue(of(testGroupNotifications));
      component.getMonitor.monitorSingleFire = jasmine.createSpy('monitorSingleFire');
      component.selectedLspGroup = { id: fakeBigNumber(), name: faker.random.word() };

      fixture.detectChanges();
      component.ngOnChanges();
    });

    it('Should call getGroupNotifications$', () => {
      expect(mockService.getGroupNotifications$).toHaveBeenCalled();
    });

    it('Should populate the rawNotifications', () => {
      expect(component.rawNotifications.length).toEqual(testGroupNotifications.length);
      expect(component.rawNotifications[0].notificationId).toEqual(
        testGroupNotifications[0].notificationId,
      );
      expect(component.rawNotifications[1].message).toEqual(testGroupNotifications[1].message);
      expect(component.rawNotifications[2].expirationDateUtc).toEqual(
        testGroupNotifications[2].expirationDateUtc,
      );
    });

    it('Should populate the form array', () => {
      expect(component.notifications.data.length).toEqual(testGroupNotifications.length);
      expect(
        (component.notifications.data[0] as FormGroupNotificationEntry).notification.notificationId,
      ).toEqual(testGroupNotifications[0].notificationId);
      expect(
        (component.notifications.data[1] as FormGroupNotificationEntry).notification.message,
      ).toEqual(testGroupNotifications[1].message);
      expect(
        (component.notifications.data[2] as FormGroupNotificationEntry).notification
          .expirationDateUtc,
      ).toEqual(testGroupNotifications[2].expirationDateUtc);
    });

    it('Should populate the table notifications', () => {
      expect(component.notifications.data.length).toEqual(testGroupNotifications.length);
      expect(component.allMonitors).toContain(component.notifications.data[0].postMonitor);
    });
  });
});
