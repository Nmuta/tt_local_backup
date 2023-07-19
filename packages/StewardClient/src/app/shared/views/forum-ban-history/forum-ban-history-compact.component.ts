import { Component } from '@angular/core';
import { ForumBanHistoryComponent } from './forum-ban-history.component';

/** Retreives and displays Forum Ban history by XUID. */
@Component({
  selector: 'forum-ban-history-compact',
  templateUrl: './forum-ban-history-compact.component.html',
  styleUrls: ['./forum-ban-history-compact.component.scss'],
})
export class ForumBanHistoryCompactComponent extends ForumBanHistoryComponent {}
