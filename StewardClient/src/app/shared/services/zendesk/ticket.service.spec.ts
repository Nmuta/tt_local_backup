import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { TicketService } from './ticket.service';
import { createMockZendeskService } from './zendesk.service.mock';

describe('TicketService', () => {
  let service: TicketService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [createMockZendeskService()],
      schemas: [NO_ERRORS_SCHEMA],
    });
    service = TestBed.inject(TicketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getTicketRequestorGamertag$', () => {
    it('should work', done => {
      service.getTicketRequestorGamertag$().subscribe(_v => {
        done();
      });
    });
  });

  describe('getForzaTitle$', () => {
    it('should work', done => {
      service.getForzaTitle$().subscribe(_v => {
        done();
      });
    });
  });
});
