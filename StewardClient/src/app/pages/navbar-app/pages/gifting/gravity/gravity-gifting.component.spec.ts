import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { createMockMsalService } from '@mocks/msal.service.mock';
import { IdentityResultAlphaBatch } from '@models/identity-query.model';
import { NgxsModule, Store } from '@ngxs/store';
import { UpdateCurrentGiftingPageTitle } from '@shared/state/user/user.actions';
import { UserState } from '@shared/state/user/user.state';
import { GravityGiftingComponent } from './gravity-gifting.component';
import { GravityGiftingState } from './state/gravity-gifting.state';
import { SetGravitySelectedPlayerIdentities } from './state/gravity-gifting.state.actions';

describe('GravityGiftingComponent', () => {
  let component: GravityGiftingComponent;
  let fixture: ComponentFixture<GravityGiftingComponent>;

  let mockStore: Store;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule.withRoutes([]),
          HttpClientTestingModule,
          NgxsModule.forRoot([UserState, GravityGiftingState]),
        ],
        declarations: [GravityGiftingComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [createMockMsalService()],
      }).compileComponents();

      fixture = TestBed.createComponent(GravityGiftingComponent);
      component = fixture.debugElement.componentInstance;

      mockStore = TestBed.inject(Store);
      mockStore.dispatch = jasmine.createSpy('dispatch');
    }),
  );
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: ngOnInit', () => {
    it('should displatch UpdateCurrentGiftingPageTitle with correct data', () => {
      component.ngOnInit();

      expect(mockStore.dispatch).toHaveBeenCalledWith(new UpdateCurrentGiftingPageTitle(component.title));
    })
  });

  describe('Method: selectedPlayerIndentities', () => {
    let event: IdentityResultAlphaBatch;
    beforeEach(() => {
      event = [{
        query: undefined,
        xuid: BigInt(123456789)
      }];
    });
    it('should displatch SetGravitySelectedPlayerIdentities with correct data', () => {
      component.selectedPlayerIndentities(event);

      expect(mockStore.dispatch).toHaveBeenCalledWith(new SetGravitySelectedPlayerIdentities(event));
    })
  });
});
