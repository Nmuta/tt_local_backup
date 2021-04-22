import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { RequestAccessToken } from '@shared/state/user/user.actions';
import { MatIconRegistryService } from '@services/mat-icon-registry';

/** Defines the app component. */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(
    private readonly store: Store,
    private readonly registryService: MatIconRegistryService,
  ) {
    this.store.dispatch(new RequestAccessToken());

    this.registryService.initialize();
  }
}
