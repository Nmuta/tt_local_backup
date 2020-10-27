import { Component, Input, OnInit } from '@angular/core';

/** Retrieves and displays Sunrise Overview by XUID. */
@Component({
  selector: 'sunrise-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  @Input() public xuid?: number;

  public data: object[];

  constructor() { }

  /** Initialization hook. */
  public ngOnInit(): void {
  }

}
