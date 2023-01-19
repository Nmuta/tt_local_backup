import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouteMemoryRedirectGuard } from 'app/route-guards/route-memory/route-memory-redirect.guard';
import { RouteMemorySetGuard } from 'app/route-guards/route-memory/route-memory-set.guard';
import { WaitingForInputComponent } from '../auction/waiting-for-input/waiting-for-input.component';
import { BuildersCupCalendarComponent } from './builders-cup-calendar.component';
import { SteelheadBuildersCupCalendarViewComponent } from './components/builders-cup-calendar-view/steelhead/steelhead-builders-cup-calendar-view.component';

const routes: Routes = [
  {
    path: '',
    component: BuildersCupCalendarComponent,
    data: { tool: 'buildersCupCalendar' },
    children: [
      {
        path: '',
        component: WaitingForInputComponent,
        canActivate: [RouteMemoryRedirectGuard],
        pathMatch: 'full',
      },
      {
        path: 'steelhead',
        canActivate: [RouteMemorySetGuard],
        component: SteelheadBuildersCupCalendarViewComponent,
      },
    ],
  },
];

/** Defines the auction tool routing module. */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BuildersCupCalendarRoutingModule {}
