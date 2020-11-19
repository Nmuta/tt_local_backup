import { Component, OnInit } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { environment } from '@environments/environment';

/** Handles the login auth action. */
@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  constructor(public readonly msalService: MsalService) { }

  /** OnInit hook. */
  public ngOnInit(): void {
    this.login();
  }

  /** Launches the login popup. */
  public login(): void {
    this.msalService.loginPopup({
      extraScopesToConsent: [environment.azureAppScope],
    });
  }
}
