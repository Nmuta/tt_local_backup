// -----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//   Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import { MsalService } from "@azure/msal-angular";
export class MockMsalService {
    public flush = jasmine.createSpy('flush');
    public trackPageView = jasmine.createSpy('trackPageView');
    public trackTrace = jasmine.createSpy('trackTrace');
    public trackException = jasmine.createSpy('trackException');
    public trackEvent = jasmine.createSpy('trackEvent');
}

export function createMockMsalService() {
    return { provide: MsalService, useValue: new MockMsalService() };
}
