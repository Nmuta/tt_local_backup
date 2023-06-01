import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TitleMemoryRedirectGuard } from 'app/route-guards/title-memory-redirect.guard';
import { TitleMemorySetGuard } from 'app/route-guards/title-memory-set.guard';
import { AcLogReaderComponent } from './ac-log-reader.component';
import { SteelheadAcLogReaderComponent } from './steelhead/steelhead-ac-log-reader.component';

const routes: Routes = [
  {
    path: '',
    component: AcLogReaderComponent,
    data: { tool: 'acLogReader' },
    children: [
      {
        path: '',
        canActivate: [TitleMemoryRedirectGuard],
        pathMatch: 'full',
      },
      {
        path: 'steelhead',
        component: SteelheadAcLogReaderComponent,
        canActivate: [TitleMemorySetGuard],
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
export class AcLogReaderRouterModule {}
