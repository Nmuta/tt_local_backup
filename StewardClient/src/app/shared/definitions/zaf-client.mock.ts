import { of } from 'rxjs';
import { ZafClient } from './zaf-client';

/** A Mock ZAF client. */
export class MockZafClient implements ZafClient {
  public set = jasmine.createSpy('set').and.returnValue(of({}));
  public has = jasmine.createSpy('has').and.returnValue(of({}));
  public instance = jasmine.createSpy('instance').and.returnValue(of({}));
  public metadata = jasmine.createSpy('metadata').and.returnValue(of({}));
  public off = jasmine.createSpy('off').and.returnValue(of({}));
  public on = jasmine.createSpy('on').and.returnValue(of({}));
  public trigger = jasmine.createSpy('trigger').and.returnValue(of({}));
  public get = jasmine.createSpy('get').and.returnValue(of({}));
  public request = jasmine.createSpy('request').and.returnValue(of({}));
  public context = jasmine.createSpy('context').and.returnValue(of({}));
  public invoke = jasmine.createSpy('invoke').and.returnValue(of({}));
}
