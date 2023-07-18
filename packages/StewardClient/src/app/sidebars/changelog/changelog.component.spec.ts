import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgxsModule } from '@ngxs/store';
import { createMockChangelogService } from '@services/changelog/changelog.service.mock';
import { createMockUserService } from '@services/user';
import { UserSettingsState } from '@shared/state/user-settings/user-settings.state';

import { ChangelogComponent } from './changelog.component';

describe('ChangelogComponent', () => {
  let component: ChangelogComponent;
  let fixture: ComponentFixture<ChangelogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChangelogComponent],
      imports: [NgxsModule.forRoot([UserSettingsState]), MatSnackBarModule],
      providers: [createMockUserService(), createMockChangelogService()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangelogComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
