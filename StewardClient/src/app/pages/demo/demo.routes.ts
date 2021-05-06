import { Routes } from '@angular/router';
import { ColorsComponent } from './colors/colors.component';
import { IconsComponent } from './icons/icons.component';
import { SelectorHelperComponent } from './selector-helper/selector-helper.component';

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
];
