import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AuthComponent } from './auth.cmpt';
import { AuthRouterModule } from './auth.routing.module';

/** Auth Module */
@NgModule({
    imports: [
        CommonModule,
        AuthRouterModule
    ],
    declarations: [AuthComponent],
})
export class AuthModule {}
