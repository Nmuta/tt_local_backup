import { TestBed } from '@angular/core/testing';
import {
  MatLegacyDialog as MatDialog,
  MatLegacyDialogModule as MatDialogModule,
} from '@angular/material/legacy-dialog';
import { ClickEnlargeImageDirective } from './click-enlarge-image.directive';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe('ClickEnlargeImageDirective', () => {
  let dialog: MatDialog;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule],
    });

    dialog = TestBed.inject(MatDialog);
    dialog.open = jasmine.createSpy('open');
  });
  it('should create an instance', () => {
    const directive = new ClickEnlargeImageDirective(dialog);
    expect(directive).toBeTruthy();
  });

  it('should open dialog with image model', () => {
    const directive = new ClickEnlargeImageDirective(dialog);
    const event = new Event('click');
    directive.onClick(event);
    expect(dialog.open).toHaveBeenCalled();
  });
});
