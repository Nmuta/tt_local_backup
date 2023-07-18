/** A mock for the console object. */
export class MockConsole {
  public log = jasmine.createSpy('log');
  public warn = jasmine.createSpy('warn');
  public debug = jasmine.createSpy('debug');
}
