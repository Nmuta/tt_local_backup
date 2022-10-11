import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EndpointsNavToolComponent } from './endpoints-nav-tool/endpoints-nav-tool.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AppRoutingModule } from 'app/app.routing';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  declarations: [
    EndpointsNavToolComponent
  ],
  imports: [
    CommonModule,
    MatTooltipModule,
    FormsModule,
    MatFormFieldModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    AppRoutingModule,
    MatButtonToggleModule,
  ]
})
export class EndpointsModule { }
