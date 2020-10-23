import { FakeApiBase } from "./fake-api.base";

export class FakeUserDetailsApi extends FakeApiBase {
  public get canHandle(): boolean {
    return true;
  }
  public handle(): string {
    return "{}";
  }
}