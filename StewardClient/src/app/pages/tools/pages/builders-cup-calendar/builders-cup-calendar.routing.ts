import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TitleMemoryRedirectGuard } from 'app/route-guards/title-memory-redirect.guard';
import { TitleMemorySetGuard } from 'app/route-guards/title-memory-set.guard';
import { BuildersCupCalendarComponent } from './builders-cup-calendar.component';

const routes: Routes = [
  {
    path: '',
    component: BuildersCupCalendarComponent,
    data: { tool: 'BuildersCupCalendar' },
    children: [
      {
        path: '',
        canActivate: [TitleMemoryRedirectGuard],
        pathMatch: 'full',
      },
      {
        path: 'steelhead',
        canActivate: [TitleMemorySetGuard],
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
