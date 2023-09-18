import { Component, inject, Input } from '@angular/core';
import { IStepOption, TourService } from 'ngx-ui-tour-md-menu';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

/**
 * Renders a tour step.
 * Based on https://github.com/hakimio/ngx-ui-tour/issues/91
 */
@Component({
  selector: 'app-tour-step',
  templateUrl: './tour-step.component.html',
  styleUrls: ['./tour-step.component.scss'],
  imports: [MatCardModule, MatButtonModule, MatIconModule, NgIf, MatIconModule],
  standalone: true,
})
export class TourStepComponent {
  /** The step data. */
  @Input() public step!: IStepOption;

  public tourService = inject(TourService);
}
