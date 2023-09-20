import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { createMockMsalServices } from '@mocks/msal.service.mock';
import { NgxsModule, Store } from '@ngxs/store';
import { createMockLoggerService } from '@services/logger/logger.service.mock';
import { UserState } from '@shared/state/user/user.state';

import { GiftHistoryComponent } from './gift-history.component';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe('GiftHistoryComponent', () => {
  let component: GiftHistoryComponent;
  let fixture: ComponentFixture<GiftHistoryComponent>;

  let mockStore: Store;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        imports: [
          RouterTestingModule.withRoutes([]),
          HttpClientTestingModule,
          NgxsModule.forRoot([UserState]),
        ],
        declarations: [GiftHistoryComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [...createMockMsalServices(), createMockLoggerService()],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(GiftHistoryComponent);
    component = fixture.debugElement.componentInstance;

    mockStore = TestBed.inject(Store);
    mockStore.dispatch = jasmine.createSpy('dispatch');
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set navbar tool list correct', () => {
    fixture.detectChanges();

    expect(component.navbarRouterLinks.length).toEqual(4);
  });
});
