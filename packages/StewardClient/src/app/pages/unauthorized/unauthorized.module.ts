import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
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
