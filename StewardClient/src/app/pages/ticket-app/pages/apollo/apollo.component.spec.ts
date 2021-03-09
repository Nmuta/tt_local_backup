import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameTitleCodeName } from '@models/enums';
import { NgxsModule, Store } from '@ngxs/store';
import { ApolloService, createMockApolloService } from '@services/apollo';
import { createMockTicketService } from '@services/zendesk';
import { of } from 'rxjs';
import faker from 'faker';

import { ApolloComponent } from './apollo.component';

describe('ApolloComponent - Ticket App', () => {
  let component: ApolloComponent;
  let fixture: ComponentFixture<ApolloComponent>;

  let mockStore: Store;
  let mockApolloService: ApolloService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApolloComponent],
      imports: [NgxsModule.forRoot([])],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [createMockApolloService(), createMockTicketService()],
    }).compileComponents();

    fixture = TestBed.createComponent(ApolloComponent);
    component = fixture.componentInstance;

    mockStore = TestBed.inject(Store);
    mockStore.dispatch = jasmine.createSpy('dispatch').and.returnValue(of());

    mockApolloService = TestBed.inject(ApolloService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: isInCorrectTitleRoute', () => {
    describe('When gameTitle matches Apollo', () => {
      it('should return true', () => {
        const result = component.isInCorrectTitleRoute(GameTitleCodeName.FM7);

        expect(result).toBeTruthy();
      });
    });
    describe('When gameTitle does not match Apollo', () => {
      it('should return true', () => {
        const result = component.isInCorrectTitleRoute(GameTitleCodeName.FH4);

        expect(result).toBeFalsy();
      });
    });
  });

  describe('Method: requestPlayerIdentity', () => {
    const gamertag = faker.name.firstName();

    it('should send request to apolloService.getPlayerIdentity ', () => {
      component.requestPlayerIdentity(gamertag);

      expect(mockApolloService.getPlayerIdentity).toHaveBeenCalledWith({ gamertag: gamertag });
    });
  });
});
