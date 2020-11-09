import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';

/** Defines a player details information item. */
@Component({
  selector: 'content-collapse',
  templateUrl: './content-collapse.html',
  styleUrls: ['./content-collapse.scss'],
})
export class ContentCollapseComponent {
  /** Initial state of the content (collapsed or expanded). */
  @Input() public contentCollapsed: boolean = false;

  public minusIcon = faMinus;
  public plusIcon = faPlus;
}
