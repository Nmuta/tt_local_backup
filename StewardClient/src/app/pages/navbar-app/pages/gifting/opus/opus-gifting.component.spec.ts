import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { createMockMsalService } from '@mocks/msal.service.mock';
import { IdentityResultAlphaBatch } from '@models/identity-query.model';
import { NgxsModule, Store } from '@ngxs/store';
import { UserState } from '@shared/state/user/user.state';
import { OpusGiftingComponent } from './opus-gifting.component';
import { OpusGiftingState } from './state/opus-gifting.state';
import { SetOpusSelectedPlayerIdentities } from './state/opus-gifting.state.actions';

describe('OpusGiftingComponent', () => {
  let component: OpusGiftingComponent;
  let fixture: ComponentFixture<OpusGiftingComponent>;

  let mockStore: Store;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule.withRoutes([]),
          HttpClientTestingModule,
          NgxsModule.forRoot([UserState, OpusGiftingState]),
        ],
        declarations: [OpusGiftingComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [createMockMsalService()],
      }).compileComponents();

      fixture = TestBed.createComponent(OpusGiftingComponent);
      component = fixture.debugElement.componentInstance;

      mockStore = TestBed.inject(Store);
      mockStore.dispatch = jasmine.createSpy('dispatch');
    }),
  );
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: selectedPlayerIndentities', () => {
    let event: IdentityResultAlphaBatch;
    beforeEach(() => {
      event = [{
        query: undefined,
        xuid: BigInt(123456789)
      }];
    });
    it('should displatch SetOpusSelectedPlayerIdentities with correct data', () => {
      component.selectedPlayerIndentities(event);

      expect(mockStore.dispatch).toHaveBeenCalledWith(new SetOpusSelectedPlayerIdentities(event));
    })
  });
});
