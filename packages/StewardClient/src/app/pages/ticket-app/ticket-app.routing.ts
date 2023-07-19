import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FourOhFourComponent } from '@shared/views/four-oh-four/four-oh-four.component';
import { AuthGuard } from 'app/route-guards/auth.guard';
import { sidebarRoutes } from 'app/sidebars/sidebars.module';
import { ApolloComponent } from './pages/apollo/apollo.component';
import { OpusComponent } from './pages/opus/opus.component';
import { WoodstockComponent } from './pages/woodstock/woodstock.component';
import { SteelheadComponent } from './pages/steelhead/steelhead.component';
import { SunriseComponent } from './pages/sunrise/sunrise.component';
import { UnknownTitleComponent } from './pages/unknown-title/unknown-title.component';
import { TicketAppComponent } from './ticket-app.component';

const routes: Routes = [
  {
    path: 'title',
    component: TicketAppComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {
        path: '',
        component: UnknownTitleComponent,
        pathMatch: 'full',
      },
      {
        path: 'woodstock',
        component: WoodstockComponent,
      },
      {
        path: 'steelhead',
        component: SteelheadComponent,
      },
      {
        path: 'opus',
        component: OpusComponent,
      },
      {
        path: 'apollo',
        component: ApolloComponent,
      },
      {
        path: 'sunrise',
        component: SunriseComponent,
      },
      ...sidebarRoutes,
      {
        path: '**',
        component: FourOhFourComponent,
      },
    ],
  },
];

/** Defines the ticket sidebar routing module. */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TicketAppRouterModule {}
