import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { GameTitleCodeNames } from '@models/enums';

/** Shared module for title dropdown. */
@Component({
  selector: 'title-dropdown',
  templateUrl: './title-dropdown.component.html',
  styleUrls: ['./title-dropdown.component.scss'],
})
export class TitleDropdownComponent implements OnInit {
  @Input() titleOptions: GameTitleCodeNames[];
  @Input() selectedOption: GameTitleCodeNames;
  @Output() newTitleSelectedEvent = new EventEmitter<GameTitleCodeNames>();

  constructor() {
    // Empty
  }

  /** Initialization hook. */
  public ngOnInit(): void {
    if (!this.titleOptions || this.titleOptions.length <= 0) {
      throw new Error('Invalid title options were given to the TitleDropdownComponent.');
    }
  }

  /** Outputs new title selected event */
  public newTitleSelection(title: GameTitleCodeNames): void {
    this.newTitleSelectedEvent.emit(title);
  }
}
