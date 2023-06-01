import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TitleMemoryRedirectGuard } from 'app/route-guards/title-memory-redirect.guard';
import { TitleMemorySetGuard } from 'app/route-guards/title-memory-set.guard';
import { ShowroomCalendarComponent } from './showroom-calendar.component';
import { SteelheadShowroomCalendarViewComponent } from './components/showroom-calendar-view/steelhead/steelhead-showroom-calendar-view.component';

const routes: Routes = [
  {
    path: '',
    component: ShowroomCalendarComponent,
    data: { tool: 'showroomCalendar' },
    children: [
      {
        path: '',
        canActivate: [TitleMemoryRedirectGuard],
        pathMatch: 'full',
      },
      {
        path: 'steelhead',
        canActivate: [TitleMemorySetGuard],
        component: SteelheadShowroomCalendarViewComponent,
      },
    ],
  },
];

/** Defines the auction tool routing module. */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShowroomCalendarRoutingModule {}
