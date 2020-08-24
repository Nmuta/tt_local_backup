// General
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed, inject, getTestBed } from '@angular/core/testing';

// Components
import { InventoryComponent } from './inventory.cmpt';

describe('InventoryComponent', () => {
    let fixture: ComponentFixture<InventoryComponent>;
    let component: InventoryComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [InventoryComponent],
            schemas: [NO_ERRORS_SCHEMA],
            providers: []
        }).compileComponents();

        fixture = TestBed.createComponent(InventoryComponent);
        component = fixture.debugElement.componentInstance;
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
