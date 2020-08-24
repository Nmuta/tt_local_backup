import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ProfileModule } from '@shared/components/profile/profile.module';

import { SidebarComponent } from './side-bar.cmpt';
import { SidebarRouterModule } from './side-bar.routing.module';

/** Sidebar module */
@NgModule({
    imports: [
        CommonModule,
        SidebarRouterModule,
        FontAwesomeModule,
        MatButtonModule,
        ProfileModule
    ],
    providers: [],
    declarations: [SidebarComponent]
})
export class SidebarModule {}
