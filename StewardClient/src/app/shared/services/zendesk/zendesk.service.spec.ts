import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ZendeskService } from './zendesk.service';
import { ZafClientService } from './zaf-client.service';
import { createMockZafClientService } from './zaf-client.service.mock';

describe('service: UserService', () => {
  let service: ZendeskService;
  let mockZafClientService: ZafClientService;
  let mockZafClient: ZAFClient.ZafClientActual;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [ZendeskService, createMockZafClientService()],
    });
    service = TestBed.inject(ZendeskService);

    mockZafClientService = TestBed.inject(ZafClientService);
    mockZafClient = mockZafClientService.client;
    mockZafClient.get = jasmine.createSpy('get').and.returnValue(of({}));
    mockZafClient.request = jasmine.createSpy('request').and.returnValue(of({}));
    mockZafClient.context = jasmine.createSpy('context').and.returnValue(of({}));
    mockZafClient.invoke = jasmine.createSpy('invoke').and.returnValue({});
  });

  describe('Method: getTicketDetails', () => {
    it('should use zafClient loaded into the window to get the ticket info', done => {
      service.getTicketDetails().subscribe(() => {
        expect(mockZafClient.get).toHaveBeenCalledWith(`ticket`);
        done();
      });
    });
  });

  describe('Method: getTicketRequestor', () => {
    it('should use zafClient loaded into the window to get the ticket requestor info', done => {
      service.getTicketRequestor().subscribe(() => {
        expect(mockZafClient.get).toHaveBeenCalledWith(`ticket.requester`);
        done();
      });
    });
  });

  describe('Method: getTicketFields', () => {
    it('should use zafClient loaded into the window to get the ticket fields', done => {
      service.getTicketFields().subscribe(() => {
        expect(mockZafClient.get).toHaveBeenCalledWith(`ticketFields`);
        done();
      });
    });
  });

  describe('Method: getTicketCustomField', () => {
    const param = 'test';
    
    it('should use zafClient loaded into the window to get the custom ticket field', done => {
      service.getTicketCustomField(param).subscribe(() => {
        expect(mockZafClient.get).toHaveBeenCalledWith(`ticket.customField:${param}`);
        done();
      });
    });
  });

  describe('Method: sendRequest', () => {
    const param = { headers: { foo: 'bar' } };
    it('should use zafClient loaded into the window to send a request', done => {
      service.sendRequest(param).subscribe(() => {
        expect(mockZafClient.request).toHaveBeenCalledWith(param);
        done();
      });
    });
  });

  describe('Method: currentUser', () => {
    it('should use zafClient loaded into the window to get the ticket fields', done => {
      service.currentUser().subscribe(() => {
        expect(mockZafClient.get).toHaveBeenCalledWith(`currentUser`);
        done();
      });
    });
  });

  describe('Method: context', () => {
    it('should use zafClient loaded into the window to get the client context', done => {
      service.context().subscribe(() => {
        expect(mockZafClient.context).toHaveBeenCalledWith();
        done();
      });
    });
  });

  describe('Method: resize', () => {
    const height = '200px';
    const width = '100px';

    it('should use zafClient loaded into the window to resize the current app', done => {
      service.resize(width, height).subscribe(_ => {
        expect(mockZafClient.invoke).toHaveBeenCalledWith('resize', {
          width: width,
          height: height,
        });
        done();
      });
    });
  });

  describe('Method: goToApp', () => {
    const appLocation = 'test-appLocation';
    const appName = 'test-appName';
    const paramPath = 'test-paramPath';

    it('should use zafClient loaded into the window to route to a new zendesk app', done => {
      service.goToApp(appLocation, appName, paramPath).subscribe(_ => {
        expect(mockZafClient.invoke).toHaveBeenCalledWith(
          'routeTo',
          appLocation,
          appName,
          paramPath,
        );
        done();
      });
    });
  });
});
