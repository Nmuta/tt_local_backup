import { Component, Input  } from '@angular/core';
import { faCopy } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'copy-to-clipboard',
  templateUrl: './copy-to-clipboard.component.html',
  styleUrls: ['./copy-to-clipboard.component.scss']
})
export class CopyToClipboardComponent{
  /** The content to copy. */
  @Input() public content: unknown = undefined;

  public readonly copyIcon = faCopy;
}
