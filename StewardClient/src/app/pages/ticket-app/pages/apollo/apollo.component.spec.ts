import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameTitleCodeName } from '@models/enums';
import { Navigate } from '@ngxs/router-plugin';
import { NgxsModule, Store } from '@ngxs/store';
import { ApolloService, createMockApolloService } from '@services/apollo';
import { createMockTicketService, MockTicketService, TicketService } from '@services/zendesk';
import { of } from 'rxjs';

import { ApolloComponent } from './apollo.component';

describe('ApolloComponent', () => {
  let component: ApolloComponent;
  let fixture: ComponentFixture<ApolloComponent>;
  let store: Store;
  let ticketService: MockTicketService;
  let service: ApolloService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApolloComponent],
      imports: [NgxsModule.forRoot([])],
      providers: [createMockApolloService(), createMockTicketService()],
    }).compileComponents();

    ticketService = (TestBed.inject(TicketService) as unknown) as MockTicketService;

    store = TestBed.inject(Store);
    store.dispatch = jasmine.createSpy('dispatch').and.returnValue(of());

    service = TestBed.inject(ApolloService);

    fixture = TestBed.createComponent(ApolloComponent);
    component = fixture.componentInstance;

    ticketService.activeTitle = GameTitleCodeName.FM7;
  });

  it('should collect title', () => {
    fixture.detectChanges();
    expect(ticketService.getForzaTitle$).toHaveBeenCalledTimes(1);
  });

  it('should collect gamertag', () => {
    fixture.detectChanges();
    expect(ticketService.getTicketRequestorGamertag$).toHaveBeenCalledTimes(1);
    expect(service.getIdentity).toHaveBeenCalledWith({ gamertag: ticketService.activeGamertag });
    expect(component.xuid).toBeTruthy();
  });

  describe('when right title', () => {
    it('should create', () => {
      fixture.detectChanges();
      expect(component).toBeTruthy();
    });

    it('should not navigate away', () => {
      fixture.detectChanges();
      expect(store.dispatch).toHaveBeenCalledTimes(0);
    });
  });

  describe('when wrong title', () => {
    beforeEach(() => {
      ticketService.activeTitle = GameTitleCodeName.Street;
    });

    it('it should navigate to the routing page', () => {
      fixture.detectChanges();
      expect(store.dispatch).toHaveBeenCalledWith(new Navigate(['/ticket-app/title/']));
    });
  });
});
