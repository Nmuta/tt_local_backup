import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { allAngularMaterialModules } from '@helpers/ng-material';
import { ProfileModule } from '@shared/components/profile/profile.module';

import { NavbarAppComponent } from './navbar-app.component';
import { NavbarAppRouterModule } from './navbar-app.routing.module';

/** Defines the sidebar module. */
@NgModule({
  imports: [
    CommonModule,
    NavbarAppRouterModule,
    FontAwesomeModule,
    ProfileModule,
    ...allAngularMaterialModules
  ],
  providers: [],
  declarations: [NavbarAppComponent],
})
export class NavbarAppModule {}
