import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GameTitleCodeName } from '@models/enums';

/** Shared module for title dropdown. */
@Component({
  selector: 'title-dropdown',
  templateUrl: './title-dropdown.component.html',
  styleUrls: ['./title-dropdown.component.scss'],
})
export class TitleDropdownComponent implements OnInit {
  @Input() titleOptions: GameTitleCodeName[];
  @Input() selectedOption: GameTitleCodeName;
  @Output() newTitleSelectedEvent = new EventEmitter<GameTitleCodeName>();

  constructor() {
    // Empty
  }

  /** Initialization hook. */
  public ngOnInit(): void {
    console.log(this.titleOptions);
    if (!this.titleOptions || this.titleOptions.length <= 0) {
      throw new Error('Invalid title options were given to the TitleDropdownComponent.');
    }
  }

  /** Outputs new title selected event */
  public newTitleSelection(title: GameTitleCodeName): void {
    this.newTitleSelectedEvent.emit(title);
  }
}
