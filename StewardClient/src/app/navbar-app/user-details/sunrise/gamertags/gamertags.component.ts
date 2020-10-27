import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'sunrise-gamertags',
  templateUrl: './gamertags.component.html',
  styleUrls: ['./gamertags.component.scss']
})
export class GamertagsComponent implements OnInit {
  @Input() public xuid?: number;

  public data: object[];

  constructor() { }

  /** Initialization hook. */
  public ngOnInit(): void {
  }

}
