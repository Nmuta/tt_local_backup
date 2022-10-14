import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SunriseGroupNotificationsFakeApi } from '@interceptors/fake-api/apis/title/sunrise/notifications/groupNotifications';
import { CommunityMessage } from '@models/community-message';
import { GameTitle } from '@models/enums';
import { NgxsModule } from '@ngxs/store';
import { Observable, of } from 'rxjs';
import {
  FormGroupNotificationEntry,
  IndividualNotificationManagementComponent,
} from './individual-notification-management.component';
import { IndividualNotificationManagementContract } from './individual-notification-management.contract';
import { fakeBigNumber } from '@interceptors/fake-api/utility';
import { GroupNotification, PlayerNotification } from '@models/notifications.model';
import BigNumber from 'bignumber.js';

/** Test notification management service for player. */
class TestNotificationManagementService implements IndividualNotificationManagementContract {
  public gameTitle: GameTitle.Street;
  /** Get player notification. */
  public getPlayerNotifications$(): Observable<PlayerNotification[]> {
    return null;
  }
  /** Edit player community message. */
  public postEditPlayerCommunityMessage$(
    _xuid: BigNumber,
    _notificationId: string,
    _communityMessage: CommunityMessage,
  ): Observable<void> {
    return null;
  }
  /** Delete player community message. */
  public deletePlayerCommunityMessage$(
    _xuid: BigNumber,
    _notificationId: string,
  ): Observable<void> {
    return null;
  }
}

describe('NotificationManagementComponent', () => {
  let component: IndividualNotificationManagementComponent;
  let fixture: ComponentFixture<IndividualNotificationManagementComponent>;
  let testGroupNotifications: GroupNotification[];

  const mockService: TestNotificationManagementService = new TestNotificationManagementService();

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgxsModule.forRoot()],
      declarations: [IndividualNotificationManagementComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [TestNotificationManagementService],
    }).compileComponents();

    fixture = TestBed.createComponent(IndividualNotificationManagementComponent);
    component = fixture.debugElement.componentInstance;
    component.service = mockService;

    testGroupNotifications = SunriseGroupNotificationsFakeApi.make(3);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: retrieveNotifications', () => {
    beforeEach(() => {
      mockService.getPlayerNotifications$ = jasmine
        .createSpy('getGroupNotifications$')
        .and.returnValue(of(testGroupNotifications));
      component.getMonitor.monitorSingleFire = jasmine.createSpy('monitorSingleFire');
      component.selectedXuid = fakeBigNumber();

      fixture.detectChanges();
      component.ngOnChanges();
    });

    it('Should call getGroupNotifications$', () => {
      expect(mockService.getPlayerNotifications$).toHaveBeenCalled();
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
