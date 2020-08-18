import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AuthRouterModule } from "./auth.routing.module";
import { AuthCmpt } from "./auth.cmpt";


@NgModule({
    imports: [
        CommonModule,
        AuthRouterModule
    ],
    declarations: [AuthCmpt],
})
export class AuthModule {}