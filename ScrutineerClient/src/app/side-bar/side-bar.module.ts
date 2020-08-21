import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatButtonModule } from '@angular/material/button';
import { ProfileModule } from '@shared/components/profile/profile.module';
import { SidebarComponent } from './side-bar.cmpt';
import { SidebarRouterModule } from './side-bar.routing.module';

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
