import { Component, EventEmitter, Input, Output } from '@angular/core';

/** Tooling page layout. */
@Component({
  selector: 'tooling-page-layout',
  templateUrl: './tooling-page-layout.component.html',
  styleUrls: ['./tooling-page-layout.component.scss'],
})
export class ToolingPageLayoutComponent {
  @Input() public disableLspGroupSelection: boolean = true;
  @Input() public matTabSelectedIndex: number = 0;
  @Output() public matTabSelectionChangeEvent = new EventEmitter<number>();

  constructor() { /** Empty */ }

  /** Tracks when the mat tab is changed  */
  public matTabSelectionChange(index: number): void {
    this.matTabSelectionChangeEvent.emit(index);
  }
}
