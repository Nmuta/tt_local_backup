// General
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

// Services
import { WindowService, createMockWindowService } from '@shared/services/window';
import { ZendeskService } from './zendesk.service';

describe('service: UserService', () => {
  let service: ZendeskService;
  let mockWindowService: WindowService;
  let mockZafClientObject: ZAFClient.ZafClientActual;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [ZendeskService, createMockWindowService()],
    });
    service = TestBed.inject(ZendeskService);
    mockWindowService = TestBed.inject(WindowService);

    mockZafClientObject = jasmine.createSpyObj('zafClient', [
      'get',
      'request',
      'context',
      'invoke',
    ]);
    mockZafClientObject.get = jasmine.createSpy('get').and.returnValue(of({}));
    mockZafClientObject.request = jasmine.createSpy('request').and.returnValue(of({}));
    mockZafClientObject.context = jasmine.createSpy('context').and.returnValue(of({}));
    mockZafClientObject.invoke = jasmine.createSpy('invoke').and.returnValue({});
    mockWindowService.zafClient = jasmine
      .createSpy('zafClient')
      .and.returnValue(mockZafClientObject);
  });

  describe('Method: getTicketDetails', () => {
    it('should use zafClient loaded into the window to get the ticket info', done => {
      service.getTicketDetails().subscribe(() => {
        expect(mockZafClientObject.get).toHaveBeenCalledWith(`ticket`);
        done();
      });
    });
  });
  describe('Method: getTicketRequestor', () => {
    it('should use zafClient loaded into the window to get the ticket requestor info', done => {
      service.getTicketRequestor().subscribe(() => {
        expect(mockZafClientObject.get).toHaveBeenCalledWith(`ticket.requester`);
        done();
      });
    });
  });
  describe('Method: getTicketFields', () => {
    it('should use zafClient loaded into the window to get the ticket fields', done => {
      service.getTicketFields().subscribe(() => {
        expect(mockZafClientObject.get).toHaveBeenCalledWith(`ticketFields`);
        done();
      });
    });
  });
  describe('Method: getTicketCustomField', () => {
    const param = 'test';
    it('should use zafClient loaded into the window to get the custom ticket field', done => {
      service.getTicketCustomField(param).subscribe(() => {
        expect(mockZafClientObject.get).toHaveBeenCalledWith(`ticket.customField:${param}`);
        done();
      });
    });
  });
  describe('Method: sendRequest', () => {
    const param = { headers: { foo: 'bar' } };
    it('should use zafClient loaded into the window to send a request', done => {
      service.sendRequest(param).subscribe(() => {
        expect(mockZafClientObject.request).toHaveBeenCalledWith(param);
        done();
      });
    });
  });
  describe('Method: currentUser', () => {
    it('should use zafClient loaded into the window to get the ticket fields', done => {
      service.currentUser().subscribe(() => {
        expect(mockZafClientObject.get).toHaveBeenCalledWith(`currentUser`);
        done();
      });
    });
  });
  describe('Method: context', () => {
    it('should use zafClient loaded into the window to get the client context', done => {
      service.context().subscribe(() => {
        expect(mockZafClientObject.context).toHaveBeenCalledWith();
        done();
      });
    });
  });
  describe('Method: resize', () => {
    const height = '200px';
    const width = '100px';
    it('should use zafClient loaded into the window to resize the current app', done => {
      service.resize(width, height);
      expect(mockZafClientObject.invoke).toHaveBeenCalledWith('resize', {
        width: width,
        height: height,
      });
      done();
    });
  });
  describe('Method: goToApp', () => {
    const appLocation = 'test-appLocation';
    const appName = 'test-appName';
    const paramPath = 'test-paramPath';
    it('should use zafClient loaded into the window to route to a new zendesk app', done => {
      service.goToApp(appLocation, appName, paramPath);
      expect(mockZafClientObject.invoke).toHaveBeenCalledWith(
        'routeTo',
        appLocation,
        appName,
        paramPath,
      );
      done();
    });
  });
});
