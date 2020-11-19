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
  public ngOnInit(): void {
    this.logout();
  }

  /** Immediately logs out the user. */
  public logout(): void {
    this.msalService.logout();
  }
}
