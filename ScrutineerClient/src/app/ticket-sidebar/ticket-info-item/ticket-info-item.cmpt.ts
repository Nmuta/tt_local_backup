import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Clipboard } from '@shared/helpers';

/** Ticket Information Item component */
@Component({
    selector: 'ticket-info-item',
    templateUrl: './ticket-info-item.html',
    styleUrls: ['./ticket-info-item.scss']
})
export class TicketInfoItemComponent implements OnInit {
    @Input() name: string;
    @Input() value: string;
    public clipboard;
    public copied;
    public showItem;

    constructor(clipboard: Clipboard) {
        this.clipboard = clipboard;
    }

    /** ngOnInit method */
    public ngOnInit() {
        this.showItem = this.value !== undefined;
    }

    /** Copies the value provided to client clipboard */
    public copyToClipboard(val: string) {
        this.copied = true;
        this.clipboard.copyMessage(val);

        setTimeout(() => { this.copied = false; }, 1500);
    }
}
