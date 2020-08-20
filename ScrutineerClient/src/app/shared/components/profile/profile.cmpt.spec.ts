// General
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed, inject, getTestBed } from '@angular/core/testing';
import { environment } from '@environments/environment';

// Components
import { ProfileComponent } from './profile.cmpt';

// Services
import { WindowService, createMockWindowService } from '@shared/services/window';

describe('ProfileComponent', () => {
    let mockWindowService: WindowService;

    let fixture: ComponentFixture<ProfileComponent>;
    let component: ProfileComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [ProfileComponent],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                createMockWindowService()
            ]
        }).compileComponents();

        const injector = getTestBed();
        mockWindowService = injector.get(WindowService);

        fixture = TestBed.createComponent(ProfileComponent);
        component = fixture.debugElement.componentInstance;
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('Method: openAuthPageInNewTab', () => {
        beforeEach(() => {
            mockWindowService.open = jasmine.createSpy('open');
        });
        it('should call windowService.open correctly', () => {
            component.openAuthPageInNewTab();

            expect(mockWindowService.open).toHaveBeenCalledWith(`${environment.clientUrl}/auth`, '_blank');
        });
    });

    describe('Method: changeProfileTabVisibility', () => {
        describe('When profileTabVisible is false', () => {
            it('should call set profileTabVisible to true', () => {
                component.profileTabVisible = false;
                component.changeProfileTabVisibility();

                expect(component.profileTabVisible).toBeTruthy();
            });
        });
        describe('When profileTabVisible is true', () => {
            it('should call set profileTabVisible to false', () => {
                component.profileTabVisible = true;
                component.changeProfileTabVisibility();

                expect(component.profileTabVisible).toBeFalsy();
            });
        });
    });
});
