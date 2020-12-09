import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameTitleCodeName } from '@models/enums';
import { Navigate } from '@ngxs/router-plugin';
import { NgxsModule, Store } from '@ngxs/store';
import { OpusService, createMockOpusService } from '@services/opus';
import { createMockTicketService, MockTicketService, TicketService } from '@services/zendesk';
import { of } from 'rxjs';

import { OpusComponent } from './opus.component';

describe('OpusComponent', () => {
  let component: OpusComponent;
  let fixture: ComponentFixture<OpusComponent>;
  let store: Store;
  let ticketService: MockTicketService;
  let service: OpusService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OpusComponent],
      imports: [NgxsModule.forRoot([])],
      providers: [createMockOpusService(), createMockTicketService()]
    }).compileComponents();

    ticketService = TestBed.inject(TicketService) as unknown as MockTicketService;

    store = TestBed.inject(Store);
    store.dispatch = jasmine.createSpy('dispatch').and.returnValue(of())

    service = TestBed.inject(OpusService);
    
    fixture = TestBed.createComponent(OpusComponent);
    component = fixture.componentInstance;

    ticketService.activeTitle = GameTitleCodeName.FH3;
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
      ticketService.activeTitle = GameTitleCodeName.FM7;
    });
    
    it('it should navigate to the routing page', () => {
      fixture.detectChanges();
      expect(store.dispatch).toHaveBeenCalledWith(new Navigate(['/ticket-app/title/']));
    });
  })
});
