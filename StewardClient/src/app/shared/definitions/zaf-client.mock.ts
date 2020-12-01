import { ZafClient } from './zaf-client';

/** A Mock ZAF client. */
export class MockZafClient implements ZafClient {
  public set = jasmine.createSpy('set');
  public has = jasmine.createSpy('has');
  public instance = jasmine.createSpy('instance');
  public metadata = jasmine.createSpy('metadata');
  public off = jasmine.createSpy('off');
  public on = jasmine.createSpy('on');
  public trigger = jasmine.createSpy('trigger');
  public get = jasmine.createSpy('get');
  public request = jasmine.createSpy('request');
  public context = jasmine.createSpy('context');
  public invoke = jasmine.createSpy('invoke');
}
