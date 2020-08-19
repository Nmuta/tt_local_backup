// -----------------------------------------------------------------------
// <copyright company='Microsoft Corporation'>
//   Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

// General
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed, inject, getTestBed } from '@angular/core/testing';

// Components
import { InventoryOptionsCmpt } from './inventory-options.cmpt';;

describe('InventoryOptionsCmpt', () => {
    let fixture: ComponentFixture<InventoryOptionsCmpt>;
    let component: InventoryOptionsCmpt;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [InventoryOptionsCmpt],
            schemas: [NO_ERRORS_SCHEMA],
            providers: []
        }).compileComponents();

        fixture = TestBed.createComponent(InventoryOptionsCmpt);
        component = fixture.debugElement.componentInstance;
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
