import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TitleMemoryRedirectGuard } from 'app/route-guards/title-memory-redirect.guard';
import { TitleMemorySetGuard } from 'app/route-guards/title-memory-set.guard';
import { SteelheadWelcomeCenterCalendarViewComponent } from './components/welcome-center-calendar-view/steelhead/steelhead-welcome-center-calendar-view.component';
import { WelcomeCenterCalendarComponent } from './welcome-center-calendar.component';

const routes: Routes = [
  {
    path: '',
    component: WelcomeCenterCalendarComponent,
    data: { tool: 'welcomeCenterCalendar' },
    children: [
      {
        path: '',
        canActivate: [TitleMemoryRedirectGuard],
        pathMatch: 'full',
      },
      {
        path: 'steelhead',
        canActivate: [TitleMemorySetGuard],
        component: SteelheadWelcomeCenterCalendarViewComponent,
      },
    ],
  },
];

/** Defines the auction tool routing module. */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WelcomeCenterCalendarRoutingModule {}
