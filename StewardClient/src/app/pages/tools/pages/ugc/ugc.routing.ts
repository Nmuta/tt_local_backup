import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WoodstockSearchUgcComponent } from '@views/search-ugc/woodstock/woodstock-search-ugc.component';
import { TitleMemoryRedirectGuard } from 'app/route-guards/title-memory-redirect.guard';
import { TitleMemorySetGuard } from 'app/route-guards/title-memory-set.guard';
import { UgcComponent } from './ugc.component';

const routes: Routes = [
  {
    path: '',
    component: UgcComponent,
    data: { tool: 'ugc' },
    children: [
      {
        path: '',
        canActivate: [TitleMemoryRedirectGuard],
        pathMatch: 'full',
      },
      {
        path: 'woodstock',
        canActivate: [TitleMemorySetGuard],
        component: WoodstockSearchUgcComponent,
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
export class UgcRoutingModule {}
