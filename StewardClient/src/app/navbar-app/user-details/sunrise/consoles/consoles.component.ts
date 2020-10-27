import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'sunrise-consoles',
  templateUrl: './consoles.component.html',
  styleUrls: ['./consoles.component.scss']
})
export class ConsolesComponent implements OnInit {
  @Input() public xuid?: number;

  public data: object[];

  constructor() { }

  /** Initialization hook. */
  public ngOnInit(): void {
  }

}
