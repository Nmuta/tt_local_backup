import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { RequestAccessToken } from '@shared/state/user/user.actions';
import { MatIconRegistryService } from '@services/mat-icon-registry';
import { VerifyEndpointKeyDefaults } from '@shared/state/user-settings/user-settings.actions';

/** Defines the app component. */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private readonly store: Store,
    private readonly registryService: MatIconRegistryService,
  ) {
    this.registryService.initialize();
  }

  /** Initialization hook. */
  public ngOnInit(): void {
    this.store.dispatch(new RequestAccessToken());
    this.store.dispatch(new VerifyEndpointKeyDefaults());
  }
}
