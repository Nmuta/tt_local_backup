import { Routes, RouterModule } from "@angular/router";
import { SidebarCmpt } from "./side-bar.cmpt";
import { NgModule } from "@angular/core";

const routes: Routes = [
    {
        path: '',
        component: SidebarCmpt,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SidebarRouterModule {}