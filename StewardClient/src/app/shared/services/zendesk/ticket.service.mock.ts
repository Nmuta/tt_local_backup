import { Injectable, Provider } from '@angular/core';
import { GameTitleCodeName } from '@models/enums';
import { defer, of } from 'rxjs';
import { TicketService } from './ticket.service';

/** Defines the mock for the Ticket Service. */
@Injectable()
export class MockTicketService {
  public activeTitle = GameTitleCodeName.Street;
  public activeGamertag = 'gamertag';
  public getTicketRequestorGamertag$ = jasmine
    .createSpy('getTicketRequestorGamertag$')
    .and.returnValue(defer(() => of(this.activeGamertag)));
  public getForzaTitle$ = jasmine
    .createSpy('getForzaTitle$')
    .and.returnValue(defer(() => of(this.activeTitle)));
}

/** Creates an injectable mock for Ticket Service. */
export function createMockTicketService(): Provider {
  return { provide: TicketService, useValue: new MockTicketService() };
}
