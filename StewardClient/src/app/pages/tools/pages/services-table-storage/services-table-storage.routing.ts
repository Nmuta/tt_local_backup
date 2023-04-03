import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TitleMemoryRedirectGuard } from 'app/route-guards/title-memory-redirect.guard';
import { TitleMemorySetGuard } from 'app/route-guards/title-memory-set.guard';
import { ServicesTableStorageComponent } from './services-table-storage.component';
import { SteelheadServicesTableStorageComponent } from './steelhead/steelhead-services-table-storage.component';

const routes: Routes = [
  {
    path: '',
    component: ServicesTableStorageComponent,
    data: { tool: 'servicesTableStorage' },
    children: [
      {
        path: '',
        canActivate: [TitleMemoryRedirectGuard],
        pathMatch: 'full',
      },
      // https://dev.azure.com/t10motorsport/ForzaTech/_dashboards/dashboard/a38b680b-c8f2-431a-8a3a-ff1bbf473d95
      // {
      //   path: 'woodstock',
      //   component: WoodstockServicesTableStorageComponent,
      //   canActivate: [TitleMemorySetGuard],
      //   pathMatch: 'full',
      // },
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
