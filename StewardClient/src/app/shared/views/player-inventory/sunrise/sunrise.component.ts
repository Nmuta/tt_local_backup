import { Component, Input, OnInit } from '@angular/core';
import { IdentityResultAlpha } from '@models/identity-query.model';

@Component({
  selector: 'sunrise-player-inventory',
  templateUrl: './sunrise.component.html',
  styleUrls: ['./sunrise.component.scss']
})
export class SunrisePlayerInventoryComponent implements OnInit {
  @Input() public identity: IdentityResultAlpha;

  constructor() { }

  ngOnInit(): void {
  }

}
