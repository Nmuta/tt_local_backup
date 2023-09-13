import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PathParams } from '@models/path-params';
import { CarDetailsComponent } from './car-details.component';
import { WoodstockSelectCarDetailsComponent } from './components/select-car-details/woodstock/woodstock-select-car-details.component';
import { WoodstockCarDetailsComponent } from './components/car-details/woodstock/woodstock-car-details.component';
import {
  RouteMemoryRedirectGuard,
  RouteMemorySetGuard,
  TitleMemoryRedirectLandingComponent,
} from 'app/route-guards';

const routes: Routes = [
  {
    path: '',
    component: CarDetailsComponent,
    data: { tool: 'carDetails' },
    children: [
      {
        path: '',
        component: TitleMemoryRedirectLandingComponent,
        canActivate: [RouteMemoryRedirectGuard],
        pathMatch: 'full',
      },
      {
        path: 'woodstock',
        canActivate: [RouteMemorySetGuard],
        component: WoodstockSelectCarDetailsComponent,
        children: [
          {
            path: `:${PathParams.CarId}`,
            canActivate: [RouteMemorySetGuard],
            component: WoodstockCarDetailsComponent,
            pathMatch: 'full',
          },
        ],
      },
    ],
  },
];

/** Defines the car details routing module. */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CarDetailsRoutingModule {}
