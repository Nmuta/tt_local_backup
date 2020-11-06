import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { BaseComponent } from '@components/base-component/base-component.component';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';

/** Defines a player details information item. */
@Component({
  selector: 'content-collapse',
  templateUrl: './content-collapse.html',
  styleUrls: ['./content-collapse.scss'],
})
export class ContentCollapseComponent extends BaseComponent {
  @Input() public contentCollapsedBool: boolean;
  @Output() public onCollapsedStateChange = new EventEmitter<boolean>();

  public minusIcon = faMinus;
  public plusIcon = faPlus;

  constructor() {
    super();
  }

  /** Emits a inverted change to the collapsed state. */
  public changeCollapsedState() {
    this.onCollapsedStateChange.emit(!this.contentCollapsedBool);
  }
}
