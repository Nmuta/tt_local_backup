import { Component, Input, OnInit } from '@angular/core';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { LspGroup } from '@models/lsp-group';

@Component({
  selector: 'woodstock-gift-special-liveries',
  templateUrl: './woodstock-gift-special-liveries.component.html',
  styleUrls: ['./woodstock-gift-special-liveries.component.scss']
})
export class WoodstockGiftSpecialLiveriesComponent implements OnInit {
  @Input() public playerIdentities: IdentityResultAlpha[];
  @Input() public lspGroup: LspGroup;
  @Input() public usingPlayerIdentities: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}
