import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilComponent } from './util.component';
import { DemoRouterModule } from './util.routing';
import { MatCardModule } from '@angular/material/card';
import { CenterContentsModule } from '@components/center-contents/center-contents.module';
import { ColorsComponent } from './colors/colors.component';
import { IconsComponent } from './icons/icons.component';
import { SelectorHelperComponent } from './selector-helper/selector-helper.component';
import { PipesModule } from '@shared/pipes/pipes.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { NgPipesModule } from 'ngx-pipes';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DirectivesModule } from '@shared/directives/directives.module';
import { SetFakeApiComponent } from './set-fake-api/set-fake-api.component';

/** Demonstration and style testing pages. */
@NgModule({
  declarations: [
    UtilComponent,
    ColorsComponent,
    IconsComponent,
    SelectorHelperComponent,
    SetFakeApiComponent,
  ],
  imports: [
    DemoRouterModule,
    CommonModule,
    MatCardModule,
    CenterContentsModule,
    PipesModule,
    MatExpansionModule,
    NgPipesModule,
    ClipboardModule,
    MatIconModule,
    MatTooltipModule,
    DirectivesModule,
  ],
})
export class UtilModule {}
