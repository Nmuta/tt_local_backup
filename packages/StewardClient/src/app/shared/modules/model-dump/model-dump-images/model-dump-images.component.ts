import { Component, Injector, Input } from '@angular/core';
import { ObjectEntry } from '../helpers';
import { ModelDumpChildBaseComponent } from '../helpers/model-dump-child.base.component';

/**
 * Renders a list of the model's images as a pseudo-gallery.
 */
@Component({
  selector: 'model-dump-images',
  templateUrl: './model-dump-images.component.html',
  styleUrls: ['./model-dump-images.component.scss'],
})
export class ModelDumpImagesComponent extends ModelDumpChildBaseComponent {
  /** REVIEW-COMMENT: Images to render. */
  @Input() public values: ObjectEntry<string>[];

  /** Gets the images to render, allowing for overrides. */
  public get valuesOrDefault(): ObjectEntry<string>[] {
    return this.values ?? this.processedModel?.extractedUrls?.allImages;
  }

  constructor(protected readonly injector: Injector) {
    super(injector);
  }
}
