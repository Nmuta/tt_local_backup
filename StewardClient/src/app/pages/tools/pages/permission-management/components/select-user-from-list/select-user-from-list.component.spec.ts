import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import faker from '@faker-js/faker';
import { createMockMsalServices } from '@mocks/msal.service.mock';
import { UserRole } from '@models/enums';
import { UserModel } from '@models/user.model';
import { NgxsModule, Store } from '@ngxs/store';
import { createMockBackgroundJobService } from '@services/background-job/background-job.service.mock';
import { createMockLoggerService } from '@services/logger/logger.service.mock';
import { createMockOldPermissionsService } from '@services/old-permissions';
import { createMockUserService } from '@services/user';
import { UserState } from '@shared/state/user/user.state';
import { SelectUserFromListComponent } from './select-user-from-list.component';

describe('SelectUserFromListComponent', () => {
  let component: SelectUserFromListComponent;
  let fixture: ComponentFixture<SelectUserFromListComponent>;

  let mockStore: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        NgxsModule.forRoot([UserState]),
        MatDialogModule,
      ],
      declarations: [SelectUserFromListComponent],
      providers: [
        createMockBackgroundJobService(),
        createMockUserService(),
        createMockOldPermissionsService(),
        createMockMsalServices(),
        createMockLoggerService(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectUserFromListComponent);
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
