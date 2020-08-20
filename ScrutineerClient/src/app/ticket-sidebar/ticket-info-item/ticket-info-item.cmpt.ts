import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { Clipboard } from '@shared/helpers';

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

    public ngOnInit() {
        this.showItem = this.value !== undefined;
    }

    public copyToClipboard(val: string) {
        this.copied = true;
        this.clipboard.copyMessage(val);

        setTimeout(() => { this.copied = false; }, 1500)
    }
}
