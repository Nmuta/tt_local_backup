import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CenterContentsModule } from '@components/center-contents/center-contents.module';
import { PipesModule } from '@shared/pipes/pipes.module';
import { UnauthorizedRouterModule } from './unauthorized.routing.module';
import { UnauthorizedComponent } from './unauthorized.component';

/** Defines the auth module. */
@NgModule({
  imports: [
    CommonModule,
    UnauthorizedRouterModule,
    MatCardModule,
    MatButtonModule,
    CenterContentsModule,
    PipesModule,
  ],
  declarations: [UnauthorizedComponent],
})
export class UnauthroizedModule {}
