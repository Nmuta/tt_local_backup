import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JsonDumpComponent } from './json-dump.component';
import { PipesModule } from '@shared/pipes/pipes.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { DirectivesModule } from '@shared/directives/directives.module';
import { MatTooltipModule } from '@angular/material/tooltip';

/** Utility module for displaying a blob of JSON in a uniform manner. */
@NgModule({
  declarations: [JsonDumpComponent],
  imports: [
    CommonModule,
    PipesModule,
    MatExpansionModule,
    MatButtonModule,
    FontAwesomeModule,
    ClipboardModule,
    DirectivesModule,
    MatTooltipModule,
  ],
  exports: [
    JsonDumpComponent,
  ]
})
export class JsonDumpModule { }
