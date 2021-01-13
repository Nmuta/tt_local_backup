import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA, Type } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { createMockMsalService } from '@mocks/msal.service.mock';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { NgxsModule, Store } from '@ngxs/store';
import { UserState } from '@shared/state/user/user.state';

import { GiftingBaseComponent } from './gifting.base.component';

describe('GiftingBaseComponent', () => {
  let component: GiftingBaseComponent<IdentityResultAlpha>;
  let fixture: ComponentFixture<GiftingBaseComponent<IdentityResultAlpha>>;

  let mockStore: Store;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule.withRoutes([]),
          HttpClientTestingModule,
          NgxsModule.forRoot([UserState]),
        ],
        declarations: [GiftingBaseComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [createMockMsalService()],
      }).compileComponents();

      fixture = TestBed.createComponent(
        GiftingBaseComponent as Type<GiftingBaseComponent<IdentityResultAlpha>>,
      );
      component = fixture.debugElement.componentInstance;

      mockStore = TestBed.inject(Store);
      mockStore.dispatch = jasmine.createSpy('dispatch');
    }),
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});