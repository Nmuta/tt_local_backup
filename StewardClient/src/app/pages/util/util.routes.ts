import { Routes } from '@angular/router';
import { ActionMonitorMultifireComponent } from './action-monitor-multifire/action-monitor-multifire.component';
import { ActionMonitorSinglefireComponent } from './action-monitor-singlefire/action-monitor-singlefire.component';
import { ColorsComponent } from './colors/colors.component';
import { IconsComponent } from './icons/icons.component';
import { LoggingComponent } from './logging/logging.component';
import { SelectorHelperComponent } from './selector-helper/selector-helper.component';
import { SetFakeApiComponent } from './set-fake-api/set-fake-api.component';
import { TypographyComponent } from './typography/typography.component';

export const demoRoutes: Routes = [
  {
    path: 'icons',
    component: IconsComponent,
  },
  {
    path: 'colors',
    component: ColorsComponent,
  },
  {
    path: 'selector-helper',
    component: SelectorHelperComponent,
  },
  {
    path: 'set-fake-api',
    component: SetFakeApiComponent,
  },
  {
    path: 'typography',
    component: TypographyComponent,
  },
  {
    path: 'logging',
    component: LoggingComponent,
  },
  {
    path: 'action-monitor-singlefire',
    component: ActionMonitorSinglefireComponent,
  },
  {
    path: 'action-monitor-multifire',
    children: [
      {
        path: '',
        component: ActionMonitorMultifireComponent,
      },
      {
        path: ':id/:which',
        component: ActionMonitorMultifireComponent,
      },
    ],
  },
];
