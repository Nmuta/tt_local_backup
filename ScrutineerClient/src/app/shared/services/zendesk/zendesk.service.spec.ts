// General
import { TestBed } from "@angular/core/testing";
import { HttpHeaders, HttpParams } from "@angular/common/http";
import { throwError, of, Observable } from "rxjs";

// Services
import {
  WindowService,
  createMockWindowService,
} from "@shared/services/window";
import { ZendeskService } from "./zendesk.service";

describe("service: UserService", () => {
  let service: ZendeskService;
  let mockWindowService: WindowService;
  let mockZafClientObject: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [ZendeskService, createMockWindowService()],
    });
    service = TestBed.get(ZendeskService);
    mockWindowService = TestBed.get(WindowService);

    mockZafClientObject = jasmine.createSpyObj("zafClient", [
      "get",
      "request",
      "context",
      "invoke",
    ]);
    mockZafClientObject.get = jasmine.createSpy("get").and.returnValue(of({}));
    mockZafClientObject.request = jasmine
      .createSpy("request")
      .and.returnValue(of({}));
    mockZafClientObject.context = jasmine
      .createSpy("context")
      .and.returnValue(of({}));
    mockZafClientObject.invoke = jasmine
      .createSpy("invoke")
      .and.returnValue({});
    mockWindowService.zafClient = jasmine
      .createSpy("zafClient")
      .and.returnValue(mockZafClientObject);
  });

  describe("Method: getTicketDetails", () => {
    it("should use zafClient loaded into the window to get the ticket info", done => {
      service.getTicketDetails().subscribe(res => {
        expect(mockZafClientObject.get).toHaveBeenCalledWith(`ticket`);
        done();
      });
    });
  });
  describe("Method: getTicketRequestor", () => {
    it("should use zafClient loaded into the window to get the ticket requestor info", done => {
      service.getTicketRequestor().subscribe(res => {
        expect(mockZafClientObject.get).toHaveBeenCalledWith(
          `ticket.requester`
        );
        done();
      });
    });
  });
  describe("Method: getTicketFields", () => {
    it("should use zafClient loaded into the window to get the ticket fields", done => {
      service.getTicketFields().subscribe(res => {
        expect(mockZafClientObject.get).toHaveBeenCalledWith(`ticketFields`);
        done();
      });
    });
  });
  describe("Method: getTicketCustomField", () => {
    const param = "test";
    it("should use zafClient loaded into the window to get the custom ticket field", done => {
      service.getTicketCustomField(param).subscribe(res => {
        expect(mockZafClientObject.get).toHaveBeenCalledWith(
          `ticket.customField:${param}`
        );
        done();
      });
    });
  });
  describe("Method: sendRequest", () => {
    const param = { foo: "bar" };
    it("should use zafClient loaded into the window to send a request", done => {
      service.sendRequest(param).subscribe(res => {
        expect(mockZafClientObject.request).toHaveBeenCalledWith(param);
        done();
      });
    });
  });
  describe("Method: currentUser", () => {
    it("should use zafClient loaded into the window to get the ticket fields", done => {
      service.currentUser().subscribe(res => {
        expect(mockZafClientObject.get).toHaveBeenCalledWith(`currentUser`);
        done();
      });
    });
  });
  describe("Method: context", () => {
    it("should use zafClient loaded into the window to get the client context", done => {
      service.context().subscribe(res => {
        expect(mockZafClientObject.context).toHaveBeenCalledWith();
        done();
      });
    });
  });
  describe("Method: resize", () => {
    const height = "200px";
    const width = "100px";
    it("should use zafClient loaded into the window to resize the current app", done => {
      service.resize(width, height);
      expect(mockZafClientObject.invoke).toHaveBeenCalledWith("resize", {
        width: width,
        height: height,
      });
      done();
    });
  });
  describe("Method: goToApp", () => {
    const appLocation = "test-appLocation";
    const appName = "test-appName";
    const paramPath = "test-paramPath";
    it("should use zafClient loaded into the window to route to a new zendesk app", done => {
      service.goToApp(appLocation, appName, paramPath);
      expect(mockZafClientObject.invoke).toHaveBeenCalledWith(
        "routeTo",
        appLocation,
        appName,
        paramPath
      );
      done();
    });
  });
});
