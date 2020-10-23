import { HttpRequest } from "@angular/common/http";

export abstract class FakeApiBase {
  constructor(private readonly request: HttpRequest<unknown>) { }
  public abstract get canHandle(): boolean;
  public abstract handle(): string;

}