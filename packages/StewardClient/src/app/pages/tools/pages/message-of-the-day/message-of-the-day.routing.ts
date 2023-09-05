import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  TitleMemoryRedirectGuard,
  TitleMemoryRedirectLandingComponent,
  TitleMemorySetGuard,
} from 'app/route-guards';
import { MessageOfTheDayComponent } from './message-of-the-day.component';
import { SteelheadMessageOfTheDayComponent } from './steelhead/steelhead-message-of-the-day.component';

const routes: Routes = [
  {
    path: '',
    component: MessageOfTheDayComponent,
    data: { tool: 'messageOfTheDay' },
    children: [
      {
        path: '',
        component: TitleMemoryRedirectLandingComponent,
        canActivate: [TitleMemoryRedirectGuard],
        pathMatch: 'full',
      },
      {
        path: 'steelhead',
        canActivate: [TitleMemorySetGuard],
        component: SteelheadMessageOfTheDayComponent,
        pathMatch: 'full',
      },
    ],
  },
];

/** Defines the sidebar routing module. */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MessageOfTheDayRouterModule {}
