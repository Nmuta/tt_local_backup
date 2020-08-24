import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Clipboard } from '@shared/helpers';

/** Defines the ticket information item component. */
@Component({
    selector: 'ticket-info-item',
    templateUrl: './ticket-info-item.html',
    styleUrls: ['./ticket-info-item.scss']
})
export class TicketInfoItemComponent implements OnInit {
    @Input() public name: string;
    @Input() public value: string;
    public clipboard;
    public copied;
    public showItem;

    constructor(clipboard: Clipboard) {
        this.clipboard = clipboard;
    }

    /** Logic for the OnInit component lifecycle. */
    public ngOnInit() {
        this.showItem = this.value !== undefined;
    }

    /** Copies the value provided to client clipboard. */
    public copyToClipboard(val: string) {
        this.copied = true;
        this.clipboard.copyMessage(val);

        setTimeout(() => { this.copied = false; }, 1500);
    }
}
