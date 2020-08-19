// -----------------------------------------------------------------------
// <copyright company='Microsoft Corporation'>
//   Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

// General
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed, inject, getTestBed } from '@angular/core/testing';

// Components
import { InventoryCmpt } from './inventory.cmpt';;

describe('InventoryCmpt', () => {
    let fixture: ComponentFixture<InventoryCmpt>;
    let component: InventoryCmpt;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [InventoryCmpt],
            schemas: [NO_ERRORS_SCHEMA],
            providers: []
        }).compileComponents();

        fixture = TestBed.createComponent(InventoryCmpt);
        component = fixture.debugElement.componentInstance;
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
