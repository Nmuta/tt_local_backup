import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { UserModel } from '@models/user.model';
import { NgxsModule, Store } from '@ngxs/store';
import { createMockBackgroundJobService } from '@services/background-job/background-job.service.mock';
import { createMockNotificationsService } from '@shared/hubs/notifications.service.mock';
import faker from '@faker-js/faker';

import { NotificationsComponent } from './notifications.component';
import { UserRole } from '@models/enums';
import { NotificationsService } from '@shared/hubs/notifications.service';
import { Subject } from 'rxjs';

describe('NotificationsComponent', () => {
  const urlPath = '/app/tools/foo/bar';

  let component: NotificationsComponent;
  let fixture: ComponentFixture<NotificationsComponent>;

  let mockNotificationsService: NotificationsService;
  let mockStore: Store;
  let mockRouter: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotificationsComponent],
      imports: [RouterTestingModule.withRoutes([]), NgxsModule.forRoot([])],
      providers: [createMockBackgroundJobService(), createMockNotificationsService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationsComponent);
    component = fixture.componentInstance;

    mockNotificationsService = TestBed.inject(NotificationsService);
    mockRouter = TestBed.inject(Router);
    mockStore = TestBed.inject(Store);

    mockNotificationsService.notifications$ = new Subject();
    spyOnProperty(mockRouter, 'url', 'get').and.returnValue(urlPath);
    mockStore.selectSnapshot = jasmine.createSpy('selectSnapshot');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: ngOnInit', () => {
    const name = faker.name.firstName();
    beforeEach(() => {
      mockStore.selectSnapshot = jasmine.createSpy('selectSnapshot').and.returnValue({
        emailAddress: `${name}@testemail.com`,
        role: UserRole.LiveOpsAdmin,
        name: name,
        objectId: faker.datatype.uuid(),
      } as UserModel);
    });

    it('should set backgroundJobRouterLink', () => {
      component.ngOnInit();

      expect(component.backgroundJobRouterLink).toEqual([`/app/tools/steward-user-history`]);
    });
  });
});
