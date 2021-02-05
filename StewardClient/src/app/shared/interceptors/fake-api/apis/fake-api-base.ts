import { HttpRequest } from '@angular/common/http';
import { Unprocessed } from '@models/unprocessed';

/** Base for implementation of fake API methods. */
export abstract class FakeApiBase {
  constructor(protected readonly request: HttpRequest<unknown>) {}

  /** True if this FakeApi can handle the given request. */
  public abstract get canHandle(): boolean;

  /** The object that should be returned for this request. */
  public abstract handle(body?: unknown): Unprocessed<unknown>;
}
