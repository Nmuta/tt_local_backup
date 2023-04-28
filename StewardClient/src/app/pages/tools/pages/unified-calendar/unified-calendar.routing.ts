import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouteMemoryRedirectGuard } from 'app/route-guards/route-memory/route-memory-redirect.guard';
import { RouteMemorySetGuard } from 'app/route-guards/route-memory/route-memory-set.guard';
import { SteelheadBuildersCupCalendarViewComponent } from './steelhead/components/builders-cup/builders-cup-calendar-view/steelhead/steelhead-builders-cup-calendar-view.component';
import { RacersCupCalendarComponent } from './steelhead/components/racers-cup/racers-cup-calendar/racers-cup-calendar.component';
import { SteelheadWelcomeCenterCalendarViewComponent } from './steelhead/components/welcome-center/welcome-center-calendar-view/steelhead/steelhead-welcome-center-calendar-view.component';
import { SteelheadUnifiedCalendarComponent } from './steelhead/steelhead-unified-calendar.component';
import { UnifiedCalendarComponent } from './unified-calendar.component';
const routes: Routes = [
  {
    path: '',
    component: UnifiedCalendarComponent,
    data: { tool: 'unifiedCalendar' },
    children: [
      {
        path: '',
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
