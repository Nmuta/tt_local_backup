import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  RouteMemoryRedirectGuard,
  RouteMemorySetGuard,
  TitleMemoryRedirectLandingComponent,
} from 'app/route-guards';
import { SteelheadBuildersCupCalendarViewComponent } from './steelhead/components/builders-cup/builders-cup-calendar-view/steelhead/steelhead-builders-cup-calendar-view.component';
import { RacersCupCalendarComponent } from './steelhead/components/racers-cup/racers-cup-calendar/racers-cup-calendar.component';
import { SteelheadWelcomeCenterCalendarViewComponent } from './steelhead/components/welcome-center/welcome-center-calendar-view/steelhead/steelhead-welcome-center-calendar-view.component';
import { SteelheadUnifiedCalendarComponent } from './steelhead/steelhead-unified-calendar.component';
import { UnifiedCalendarComponent } from './unified-calendar.component';
import { SteelheadRivalsCalendarViewComponent } from './steelhead/components/rivals/components/rivals-calendar-view/steelhead-rivals-calendar-view.component';
import { SteelheadShowroomCalendarViewComponent } from './steelhead/components/showroom/showroom-calendar-view/steelhead/steelhead-showroom-calendar-view.component';
const routes: Routes = [
  {
    path: '',
    component: UnifiedCalendarComponent,
    data: { tool: 'unifiedCalendar' },
    children: [
      {
        path: '',
        component: TitleMemoryRedirectLandingComponent,
        canActivate: [RouteMemoryRedirectGuard],
        pathMatch: 'full',
      },
      {
        path: 'steelhead',
        canActivate: [RouteMemorySetGuard],
        component: SteelheadUnifiedCalendarComponent,
        children: [
          {
            path: '',
            redirectTo: 'racers-cup-calendar',
            pathMatch: 'full',
          },
          {
            path: 'racers-cup-calendar',
            canActivate: [RouteMemorySetGuard],
            component: RacersCupCalendarComponent,
            pathMatch: 'full',
          },
          {
            path: 'builders-cup-calendar',
            canActivate: [RouteMemorySetGuard],
            component: SteelheadBuildersCupCalendarViewComponent,
            pathMatch: 'full',
          },
          {
            path: 'welcome-center-calendar',
            canActivate: [RouteMemorySetGuard],
            component: SteelheadWelcomeCenterCalendarViewComponent,
            pathMatch: 'full',
          },
          {
            path: 'rivals-calendar',
            canActivate: [RouteMemorySetGuard],
            component: SteelheadRivalsCalendarViewComponent,
            pathMatch: 'full',
          },
          {
            path: 'showroom-calendar',
            canActivate: [RouteMemorySetGuard],
            component: SteelheadShowroomCalendarViewComponent,
            pathMatch: 'full',
          },
        ],
      },
    ],
  },
];

/** Defines the Steward management routing module. */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UnifiedCalendarRoutingModule {}
