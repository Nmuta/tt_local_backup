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
      new Navigate(['/ticket-app/title/gravity'], null, { skipLocationChange: true }),
    );
  });

  it('should route to fm7', () => {
    ticketService.activeTitle = GameTitleCodeName.FM7;
    fixture.detectChanges();
    expect(store.dispatch).toHaveBeenCalledWith(
      new Navigate(['/ticket-app/title/apollo'], null, { skipLocationChange: true }),
    );
  });

  it('should route to opus', () => {
    ticketService.activeTitle = GameTitleCodeName.FH3;
    fixture.detectChanges();
    expect(store.dispatch).toHaveBeenCalledWith(
      new Navigate(['/ticket-app/title/opus'], null, { skipLocationChange: true }),
    );
  });

  it('should route to sunrise', () => {
    ticketService.activeTitle = GameTitleCodeName.FH4;
    fixture.detectChanges();
    expect(store.dispatch).toHaveBeenCalledWith(
      new Navigate(['/ticket-app/title/sunrise'], null, { skipLocationChange: true }),
    );
  });
});
