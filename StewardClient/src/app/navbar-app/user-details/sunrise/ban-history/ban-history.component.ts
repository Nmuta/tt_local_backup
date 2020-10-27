import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'sunrise-ban-history',
  templateUrl: './ban-history.component.html',
  styleUrls: ['./ban-history.component.scss']
})
export class BanHistoryComponent implements OnInit {
  @Input() public xuid?: number;

  public data: object[];

  constructor() { }

  /** Initialization hook. */
  public ngOnInit(): void {
  }

}
