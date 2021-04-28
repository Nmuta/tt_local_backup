import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FourOhFourComponent } from '@shared/views/four-oh-four/four-oh-four.component';
import { AuthGuard } from 'app/route-guards/auth.guard';
import { sidebarRoutes } from 'app/sidebars/sidebars.module';
import { ApolloComponent } from './pages/apollo/apollo.component';
import { GravityComponent } from './pages/gravity/gravity.component';
import { OpusComponent } from './pages/opus/opus.component';
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
        path: 'steelhead',
        component: SteelheadComponent,
      },
      {
        path: 'gravity',
        component: GravityComponent,
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
