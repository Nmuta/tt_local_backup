import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'sunrise-credit-history',
  templateUrl: './credit-history.component.html',
  styleUrls: ['./credit-history.component.scss']
})
export class CreditHistoryComponent implements OnInit {
  @Input() public xuid?: number;

  public data: object[];

  constructor() { }

  /** Initialization hook. */
  public ngOnInit(): void {
  }

}
