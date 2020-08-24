// General
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed, inject, getTestBed } from '@angular/core/testing';

// Components
import { GiftingPageComponent } from './gifting-page.component';

describe('GiftingPageComponent', () => {
    let fixture: ComponentFixture<GiftingPageComponent>;
    let component: GiftingPageComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [GiftingPageComponent],
            schemas: [NO_ERRORS_SCHEMA],
            providers: []
        }).compileComponents();

        fixture = TestBed.createComponent(GiftingPageComponent);
        component = fixture.debugElement.componentInstance;
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
