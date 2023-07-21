import { isolateTests } from "@support/cypress/isolate-tests";
import { login } from "@support/steward/auth/login";
import { disableFakeApi } from "@support/steward/util/disable-fake-api";

/**
 * Reset test context to a default state.
 *   - Clear all browser state (as with Test Isolation)
 *   - Log in
 *   - Disable the fake API
 */
export function resetToDefaultState() {
  isolateTests();
  login();
  disableFakeApi();
}