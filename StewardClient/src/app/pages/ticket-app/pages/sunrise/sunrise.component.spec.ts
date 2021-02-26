import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameTitleCodeName } from '@models/enums';
import { Navigate } from '@ngxs/router-plugin';
import { NgxsModule, Store } from '@ngxs/store';
import { SunriseService, createMockSunriseService } from '@services/sunrise';
import { createMockTicketService, MockTicketService, TicketService } from '@services/zendesk';
import { of } from 'rxjs';

import { SunriseComponent } from './sunrise.component';

describe('SunriseComponent - Ticket App', () => {
  let component: SunriseComponent;
  let fixture: ComponentFixture<SunriseComponent>;
  let store: Store;
  let ticketService: MockTicketService;
  let service: SunriseService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SunriseComponent],
      imports: [NgxsModule.forRoot([])],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [createMockSunriseService(), createMockTicketService()],
    }).compileComponents();

    ticketService = (TestBed.inject(TicketService) as unknown) as MockTicketService;

    store = TestBed.inject(Store);
    store.dispatch = jasmine.createSpy('dispatch').and.returnValue(of());

    service = TestBed.inject(SunriseService);

    fixture = TestBed.createComponent(SunriseComponent);
    component = fixture.componentInstance;

    ticketService.activeTitle = GameTitleCodeName.FH4;
    service.getPlayerIdentity = jasmine
      .createSpy('getPlayerIdentity')
      .and.returnValue(of({ gamertag: 'test', xuid: BigInt('0123456789') }));
  });

  it('should collect title', () => {
    fixture.detectChanges();
    expect(ticketService.getForzaTitle$).toHaveBeenCalledTimes(1);
  });

  it('should collect gamertag', () => {
    fixture.detectChanges();
    expect(ticketService.getTicketRequestorGamertag$).toHaveBeenCalledTimes(1);
    expect(service.getPlayerIdentity).toHaveBeenCalledWith({
      gamertag: ticketService.activeGamertag,
    });
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
      ticketService.activeTitle = GameTitleCodeName.FM7;
    });

    it('it should navigate to the routing page', () => {
      fixture.detectChanges();
      expect(store.dispatch).toHaveBeenCalledWith(
        new Navigate(['/support/ticket-app/title/'], null, { replaceUrl: true }),
      );
    });
  });
});
