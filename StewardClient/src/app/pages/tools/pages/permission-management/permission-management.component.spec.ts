import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import faker from '@faker-js/faker';
import { createMockMsalServices } from '@mocks/msal.service.mock';
import { UserRole } from '@models/enums';
import { UserModel } from '@models/user.model';
import { NgxsModule, Store } from '@ngxs/store';
import { createMockBackgroundJobService } from '@services/background-job/background-job.service.mock';
import { createMockLoggerService } from '@services/logger/logger.service.mock';
import { UserState } from '@shared/state/user/user.state';
import { PermissionManagementComponent } from './permission-management.component';

describe('PermissionManagementComponent', () => {
  let component: PermissionManagementComponent;
  let fixture: ComponentFixture<PermissionManagementComponent>;

  let mockStore: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, NgxsModule.forRoot([UserState]), HttpClientTestingModule],
      declarations: [PermissionManagementComponent],
      providers: [
        createMockBackgroundJobService(),
        createMockMsalServices(),
        createMockLoggerService(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PermissionManagementComponent);
    component = fixture.componentInstance;
    mockStore = TestBed.inject(Store);

    mockStore.selectSnapshot = jasmine.createSpy('selectSnapshot').and.returnValue({
      emailAddress: faker.internet.email(),
      role: UserRole.LiveOpsAdmin,
      name: faker.random.word(),
      objectId: faker.datatype.uuid(),
    } as UserModel);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
