import { Component } from '@angular/core';
import { BaseComponent } from '@components/base-component/base-component.component';

/** Displays the community messaging feature. */
@Component({
  selector: 'messaging',
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.scss'],
})
export class CommunityMessagingComponent extends BaseComponent {}
