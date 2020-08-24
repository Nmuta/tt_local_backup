// General
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

// Components
import { TicketInfoItemComponent } from './ticket-info-item.component';
import { createMockClipboard } from '@shared/helpers/clipboard';

describe('TicketInfoItemComponent', () => {
    let fixture: ComponentFixture<TicketInfoItemComponent>;
    let component: TicketInfoItemComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [TicketInfoItemComponent],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                createMockClipboard()
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(TicketInfoItemComponent);
        component = fixture.debugElement.componentInstance;
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
