import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FourOhFourComponent } from '@shared/views/four-oh-four/four-oh-four.component';
import { AuthGuard } from 'app/route-guards/auth.guard';
import { SunriseComponent } from '../navbar-app/pages/user-details/sunrise/sunrise.component';
import { ApolloComponent } from './pages/apollo/apollo.component';
import { GravityComponent } from './pages/gravity/gravity.component';
import { OpusComponent } from './pages/opus/opus.component';

import { TicketAppComponent } from './ticket-app.component';

const routes: Routes = [
  {
    path: 'title',
    component: TicketAppComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
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
      // TODO: Sidebar?
      {
        path: '**',
        component: FourOhFourComponent,
      },
    ]
  },
];

/** Defines the ticket sidebar routing module. */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TicketAppRouterModule {}
