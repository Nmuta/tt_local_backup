import { TestBed, getTestBed, ComponentFixture, fakeAsync, async, inject } from '@angular/core/testing';
import { WindowService } from './window.service';

describe('service: WindowService', () => {
    let injector: TestBed;
    let windowService: WindowService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [WindowService]
        });
        injector = getTestBed();
        windowService = injector.get(WindowService);
    });

    it('should be created', inject([WindowService], (service: WindowService) => {
        expect(service).toBeTruthy();
    }));
});
