import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { BaseComponent } from '@components/base-component/base.component';
import { Subject, timer } from 'rxjs';
import { debounceTime, delay, takeUntil, tap } from 'rxjs/operators';

const CopyTooltipHangTime = 1_000; /*ms*/
const BeforeCopyTooltip = 'Click to copy';
const AfterCopyTooltip = 'Copied to clipboard';
const AfterCopyFailedTooltip = 'Failed';

/** A standard utility for wrapping around copyable elements. */
@Component({
  selector: 'standard-copy',
  templateUrl: './standard-copy.component.html',
  styleUrls: ['./standard-copy.component.scss'],
})
export class StandardCopyComponent extends BaseComponent implements AfterViewInit {
  @ViewChild('content', { read: ElementRef, static: true }) content: ElementRef;
  @ViewChild('tooltip', { static: true }) tooltip: MatTooltip;

  /** Input. Override copied text. */
  @Input() get text(): string {
    return this.inputText;
  }
  /** Input. Override copied text. */
  set text(value: string) {
    this.inputText = value;
    this.updateCopyText();
  }

  /** Emits when a copy has completed. */
  private onCopy$ = new Subject<boolean>();

  /** The override value provided by parent component. */
  private inputText: string = undefined;

  /** Gets the native DOM text. */
  public get nativeText(): string {
    return this.content?.nativeElement?.innerHTML;
  }

  /** Gets the text to acctually copy. */
  public textToCopy: string = undefined;

  /** Text to display in the copy tooltip. */
  public tooltipText: string = BeforeCopyTooltip;

  /** Angular lifecycle hook. */
  public ngAfterViewInit(): void {
    if (!this.nativeText) {
      throw new Error(
        'No child element. This component is designed to wrap a child element/text and copy on hover.',
      );
    }

    if (!this.tooltip) {
      throw new Error('Tooltip component not found. Something is wrong.');
    }

    // has to happen after render phase
    timer(1)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => this.updateCopyText());

    this.onCopy$
      .pipe(
        delay(1), // updates have to happen between render phases
        tap(successful => {
          this.tooltipText = successful ? AfterCopyTooltip : AfterCopyFailedTooltip;
          this.tooltip.show();
        }),
        debounceTime(CopyTooltipHangTime),
        delay(1), // updates have to happen between render phases
        takeUntil(this.onDestroy$),
      )
      .subscribe(() => {
        this.tooltipText = BeforeCopyTooltip;
      });
  }

  /** Fired after copy has completed. */
  public onCopy(successful: boolean): void {
    this.onCopy$.next(successful);
  }

  private updateCopyText(): void {
    // prioritize parameter text
    if (!!this.text) {
      this.textToCopy = this.text;
      return;
    }

    // use native text as a fallback
    if (!!this.nativeText) {
      this.textToCopy = this.nativeText;
      return;
    }

    throw new Error('No text found to copy');
  }
}