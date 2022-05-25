import { Directive, forwardRef, Input, Renderer2 } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { BaseDirective } from '@components/base-component/base.directive';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  DisableStateProvider,
  STEWARD_DISABLE_STATE_PROVIDER,
} from '../state-managers/injection-tokens';

/** A directive that toggles the enabled state of the host button with the provided mat-checkbox. */
@Directive({
  selector: `button[mat-button][stateManager][verifyWith], button[mat-raised-button][stateManager][verifyWith], button[mat-icon-button][stateManager][verifyWith],
  button[mat-fab][stateManager][verifyWith], button[mat-mini-fab][stateManager][verifyWith], button[mat-stroked-button][stateManager][verifyWith],
  button[mat-flat-button][stateManager][verifyWith]`,
  providers: [
    {
      provide: STEWARD_DISABLE_STATE_PROVIDER,
      useExisting: forwardRef(() => VerifyWithButtonDirective),
      multi: true,
    },
  ],
})
export class VerifyWithButtonDirective extends BaseDirective implements DisableStateProvider {
  public overrideDisable: boolean = undefined;
  public overrideDisable$ = new BehaviorSubject<boolean | undefined>(this.overrideDisable);

  private checkbox: MatCheckbox = undefined;
  private checkbox$ = new Subject<MatCheckbox>();
  private isVerified = false;

  /** The checkbox to use for verification. */
  @Input()
  public set verifyWith(value: MatCheckbox) {
    this.checkbox$.next(value);
  }

  constructor(private readonly host: MatButton, private readonly renderer: Renderer2) {
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

    renderer.listen(host._elementRef.nativeElement, 'click', () => {
      this.clear();
    });
  }

  /** Programmatically clear the verification. */
  public clear(): void {
    this.checkbox.checked = false;
    this.isVerified = false;
    // Toggling checkbox from code doesn't trigger change callback. Need to manually emit.
    this.checkbox.change.emit({ source: this.checkbox, checked: false });
    this.updateHostState();
  }

  private updateHostState(): void {
    this.overrideDisable = !this.isVerified;
    this.overrideDisable$.next(this.overrideDisable);
  }
}
