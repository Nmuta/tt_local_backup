import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTooltipModule } from '@angular/material/tooltip';
import { VerifyButtonComponent } from './verify-button.component';
import { NgxsModule } from '@ngxs/store';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UserSettingsState } from '@shared/state/user-settings/user-settings.state';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('VerifyButtonComponent', () => {
  let component: VerifyButtonComponent;
  let fixture: ComponentFixture<VerifyButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerifyButtonComponent],
      imports: [
        MatTooltipModule,
        HttpClientTestingModule,
        NgxsModule.forRoot([UserSettingsState]),
        MatSnackBarModule,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyButtonComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
