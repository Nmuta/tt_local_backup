import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EndpointsNavToolComponent } from './endpoints-nav-tool/endpoints-nav-tool.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    EndpointsNavToolComponent
  ],
  imports: [
    CommonModule,
    MatTooltipModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
  ]
})
export class EndpointsModule { }
