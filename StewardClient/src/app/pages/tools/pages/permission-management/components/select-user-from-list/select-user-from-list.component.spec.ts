import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule } from '@ngxs/store';
import { createMockBackgroundJobService } from '@services/background-job/background-job.service.mock';
import { createMockOldPermissionsService } from '@services/old-permissions';
import { createMockUserService } from '@services/user';
import { SelectUserFromListComponent } from './select-user-from-list.component';

describe('SelectUserFromListComponent', () => {
  let component: SelectUserFromListComponent;
  let fixture: ComponentFixture<SelectUserFromListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        NgxsModule.forRoot([]),
        MatDialogModule,
      ],
      declarations: [SelectUserFromListComponent],
      providers: [
        createMockBackgroundJobService(),
        createMockUserService(),
        createMockOldPermissionsService(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectUserFromListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});