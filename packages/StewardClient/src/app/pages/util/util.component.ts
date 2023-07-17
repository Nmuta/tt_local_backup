import { Component } from '@angular/core';
import { Route } from '@angular/router';
import { demoRoutes } from './util.routes';

/**
 * A routed component for displaying demos.
 */
@Component({
  selector: 'app-util',
  templateUrl: './util.component.html',
  styleUrls: ['./util.component.scss'],
})
export class UtilComponent {
  public children: Route[] = demoRoutes;
}
