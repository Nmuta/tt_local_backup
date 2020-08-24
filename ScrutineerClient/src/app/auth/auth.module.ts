import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRouterModule } from './auth.routing.module';
import { AuthComponent } from './auth.cmpt';


@NgModule({
    imports: [
        CommonModule,
        AuthRouterModule
    ],
    declarations: [AuthComponent],
})
export class AuthModule {}
