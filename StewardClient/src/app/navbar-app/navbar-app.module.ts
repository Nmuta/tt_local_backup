import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ProfileModule } from '@shared/components/profile/profile.module';

import { NavbarAppComponent } from './navbar-app.component';
import { SidebarRouterModule } from './navbar-app.routing.module';

/** Defines the sidebar module. */
@NgModule({
  imports: [CommonModule, SidebarRouterModule, FontAwesomeModule, ProfileModule],
  providers: [],
  declarations: [NavbarAppComponent],
})
export class SidebarModule {}
