import { Component, OnInit } from '@angular/core';
import { MsalService } from '@azure/msal-angular';

/** Handles the logout auth action. */
@Component({
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {
  constructor(public readonly msalService: MsalService) { }

  /** OnInit hook. */
  ngOnInit(): void {
    this.msalService.logout();
  }
}
