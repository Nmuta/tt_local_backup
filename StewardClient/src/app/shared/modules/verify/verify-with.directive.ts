import { Directive, Input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { BaseDirective } from '@components/base-component/base.directive';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/** A directive that toggles the enabled state of the host button with the provided mat-checkbox. */
@Directive({
  selector: `button[mat-button][verifyWith], button[mat-raised-button][verifyWith], button[mat-icon-button][verifyWith],
  button[mat-fab][verifyWith], button[mat-mini-fab][verifyWith], button[mat-stroked-button][verifyWith],
  button[mat-flat-button][verifyWith]`,
})
export class VerifyWithButtonDirective extends BaseDirective {
  private checkbox: MatCheckbox = undefined;
  private checkbox$ = new Subject<MatCheckbox>();
  private isVerified = false;

  private disabledByTemplate = false;

  /** The checkbox to use for verification. */
  @Input()
  public set verifyWith(value: MatCheckbox) {
    this.checkbox$.next(value);
  }

  /** The disabled value to use when the monitor is not overriding it. Named to match the default @Inputs. */
  @Input()
  public set disabled(value: boolean) {
    this.disabledByTemplate = value;
    this.updateHostState();
  }

  constructor(private readonly host: MatButton) {
    super();

    this.checkbox$.pipe(takeUntil(this.onDestroy$)).subscribe(checkbox => {
      this.checkbox = checkbox;

      checkbox.change.pipe(takeUntil(this.onDestroy$)).subscribe(next => {
        this.isVerified = next.checked;
        this.updateHostState();
      });

      this.isVerified = checkbox.checked;
      this.updateHostState();
    });
  }

  /** Programmatically clear the verification. */
  public clear(): void {
    this.checkbox.checked = false;
    this.isVerified = false;
    this.updateHostState();
  }

  private updateHostState(): void {
    this.host.disabled = this.disabledByTemplate || !this.isVerified;
  }
}
