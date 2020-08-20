// -----------------------------------------------------------------------
// <copyright company='Microsoft Corporation'>
//   Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

// General
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed, inject, getTestBed } from '@angular/core/testing';

// Components
import { ProfileCmpt } from './profile.cmpt';import { WindowService, createMockWindowService } from '@shared/services/window';
import { environment } from '@environments/environment';
;

describe('ProfileComponent', () => {
    let mockWindowService: WindowService;

    let fixture: ComponentFixture<ProfileCmpt>;
    let component: ProfileCmpt;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [ProfileCmpt],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                createMockWindowService()
            ]
        }).compileComponents();

        let injector = getTestBed();
        mockWindowService = injector.get(WindowService);

        fixture = TestBed.createComponent(ProfileCmpt);
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
        })
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
