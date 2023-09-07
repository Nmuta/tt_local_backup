import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  TitleMemoryRedirectGuard,
  TitleMemoryRedirectLandingComponent,
  TitleMemorySetGuard,
} from 'app/route-guards';
import { ServicesTableStorageComponent } from './services-table-storage.component';
import { SteelheadServicesTableStorageComponent } from './steelhead/steelhead-services-table-storage.component';
import { WoodstockServicesTableStorageComponent } from './woodstock/woodstock-services-table-storage.component';

const routes: Routes = [
  {
    path: '',
    component: ServicesTableStorageComponent,
    data: { tool: 'servicesTableStorage' },
    children: [
      {
        path: '',
        component: TitleMemoryRedirectLandingComponent,
        canActivate: [TitleMemoryRedirectGuard],
        pathMatch: 'full',
      },
      {
        path: 'woodstock',
        component: WoodstockServicesTableStorageComponent,
        canActivate: [TitleMemorySetGuard],
        pathMatch: 'full',
      },
      {
        path: 'steelhead',
        component: SteelheadServicesTableStorageComponent,
        canActivate: [TitleMemorySetGuard],
        pathMatch: 'full',
      },
    ],
  },
];

/** Defines the sidebar routing module. */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServicesTableStorageRouterModule {}
