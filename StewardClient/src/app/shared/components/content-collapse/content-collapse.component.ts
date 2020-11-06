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
  @Input() public contentCollapsed: boolean = false;

  public minusIcon = faMinus;
  public plusIcon = faPlus;

  constructor() {
    super();
  }
}
