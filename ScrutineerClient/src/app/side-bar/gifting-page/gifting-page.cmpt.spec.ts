// -----------------------------------------------------------------------
// <copyright company='Microsoft Corporation'>
//   Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

// General
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed, inject, getTestBed } from '@angular/core/testing';

// Components
import { GiftingPageCmpt } from './gifting-page.cmpt';;

describe('GiftingPageCmpt', () => {
    let fixture: ComponentFixture<GiftingPageCmpt>;
    let component: GiftingPageCmpt;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [GiftingPageCmpt],
            schemas: [NO_ERRORS_SCHEMA],
            providers: []
        }).compileComponents();

        fixture = TestBed.createComponent(GiftingPageCmpt);
        component = fixture.debugElement.componentInstance;
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
