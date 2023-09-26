import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JsonDumpComponent } from './json-dump.component';
import { PipesModule } from '@shared/pipes/pipes.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { DirectivesModule } from '@shared/directives/directives.module';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { MatIconModule } from '@angular/material/icon';

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
    MatIconModule,
  ],
  exports: [JsonDumpComponent],
})
export class JsonDumpModule {}
