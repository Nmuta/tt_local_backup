import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameTitleCodeName } from '@models/enums';
import { Navigate } from '@ngxs/router-plugin';
import { NgxsModule, Store } from '@ngxs/store';
import { createMockTicketService, MockTicketService, TicketService } from '@services/zendesk';
import { of } from 'rxjs';

import { UnknownComponent } from './unknown.component';

describe('UnknownComponent', () => {
  let fixture: ComponentFixture<UnknownComponent>;
  let store: Store;
  let ticketService: MockTicketService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UnknownComponent],
      imports: [NgxsModule.forRoot([])],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [createMockTicketService()],
    }).compileComponents();

    ticketService = (TestBed.inject(TicketService) as unknown) as MockTicketService;

    store = TestBed.inject(Store);
    store.dispatch = jasmine.createSpy('dispatch').and.returnValue(of());

    fixture = TestBed.createComponent(UnknownComponent);

    ticketService.activeTitle = GameTitleCodeName.FH4;
  });

  it('should collect title', () => {
    fixture.detectChanges();
    expect(ticketService.getForzaTitle$).toHaveBeenCalledTimes(1);
  });

  it('should route to street', () => {
    ticketService.activeTitle = GameTitleCodeName.Street;
    fixture.detectChanges();
    expect(store.dispatch).toHaveBeenCalledWith(
      new Navigate(['/support/ticket-app/title/gravity'], null, { replaceUrl: true }),
    );
  });

  it('should route to fm7', () => {
    ticketService.activeTitle = GameTitleCodeName.FM7;
    fixture.detectChanges();
    expect(store.dispatch).toHaveBeenCalledWith(
      new Navigate(['/support/ticket-app/title/apollo'], null, { replaceUrl: true }),
    );
  });

  it('should route to opus', () => {
    ticketService.activeTitle = GameTitleCodeName.FH3;
    fixture.detectChanges();
    expect(store.dispatch).toHaveBeenCalledWith(
      new Navigate(['/support/ticket-app/title/opus'], null, { replaceUrl: true }),
    );
  });

  it('should route to sunrise', () => {
    ticketService.activeTitle = GameTitleCodeName.FH4;
    fixture.detectChanges();
    expect(store.dispatch).toHaveBeenCalledWith(
      new Navigate(['/support/ticket-app/title/sunrise'], null, { replaceUrl: true }),
    );
  });
});
