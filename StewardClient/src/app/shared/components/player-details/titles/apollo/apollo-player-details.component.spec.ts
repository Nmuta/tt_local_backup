import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, getTestBed, waitForAsync } from '@angular/core/testing';
import { ApolloPlayerDetailsComponent } from './apollo-player-details.component';
import { createMockWindowService } from '@shared/services/window';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule } from '@ngxs/store';
import { UserState } from '@shared/state/user/user.state';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { createMockMsalService } from '@shared/mocks/msal.service.mock';
import { of } from 'rxjs';
import { ApolloService, createMockMockApolloService } from '@services/apollo';
import { ApolloPlayerGamertagDetailsFakeApi } from '@interceptors/fake-api/apis/title/apollo/player/gamertag/details';

describe('ApolloPlayerDetailsComponent', () => {
  let mockApolloService: ApolloService;

  let fixture: ComponentFixture<ApolloPlayerDetailsComponent>;
  let component: ApolloPlayerDetailsComponent;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule.withRoutes([]),
          HttpClientTestingModule,
          NgxsModule.forRoot([UserState]),
        ],
        declarations: [ApolloPlayerDetailsComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [
          createMockWindowService(),
          createMockMsalService(),
          createMockMockApolloService(),
        ],
      }).compileComponents();

      const injector = getTestBed();
      mockApolloService = injector.inject(ApolloService);

      fixture = TestBed.createComponent(ApolloPlayerDetailsComponent);
      component = fixture.debugElement.componentInstance;
    }),
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method makeRequest$:', () => {
    const expectedGamertag = 'test-gamertag';
    beforeEach(() => {
      component.gamertag = expectedGamertag;
      mockApolloService.getPlayerDetailsByGamertag = jasmine
        .createSpy('getPlayerDetailsByGamertag')
        .and.returnValue(of(ApolloPlayerGamertagDetailsFakeApi.make()));
    });
    it('should return apollo player details request observable', () => {
      const apolloPlayerDetailsObs = component.makeRequest$();
      apolloPlayerDetailsObs.subscribe(_data => {
        /* nothing */
      });

      expect(mockApolloService.getPlayerDetailsByGamertag).toHaveBeenCalledWith(expectedGamertag);
    });
  });
});
