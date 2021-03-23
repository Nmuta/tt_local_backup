import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommunityMessagingComponent } from './messaging.component';

const routes: Routes = [
  {
    path: '',
    component: CommunityMessagingComponent,
  },
];

/** Defines the kusto routing module. */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommunityMessagingRoutingModule {}
