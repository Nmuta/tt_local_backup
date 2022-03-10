import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TitleMemoryRedirectGuard } from 'app/route-guards/title-memory-redirect.guard';
import { TitleMemorySetGuard } from 'app/route-guards/title-memory-set.guard';
import { RacersCupCalendarComponent } from './components/racers-cup-calendar/racers-cup-calendar.component';
import { RacersCupComponent } from './racers-cup.component';

const routes: Routes = [
  {
    path: '',
    component: RacersCupComponent,
    data: { tool: 'racersCup' },
    children: [
      {
        path: '',
        canActivate: [TitleMemoryRedirectGuard],
        pathMatch: 'full',
      },
      {
        path: 'steelhead',
        canActivate: [TitleMemorySetGuard],
        component: RacersCupCalendarComponent,
      },
    ],
  },
];

/** Defines the auction tool routing module. */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RacersCupRoutingModule {}
