import { Component } from '@angular/core';
import { Route } from '@angular/router';
import { demoRoutes } from './demo.routes';

/**
 * A routed component for displaying demos.
 */
@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss'],
})
export class DemoComponent {
  public children: Route[] = demoRoutes;
}
