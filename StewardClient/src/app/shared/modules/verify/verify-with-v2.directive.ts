import { Directive, forwardRef, Input, Renderer2 } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { BaseDirective } from '@components/base-component/base.directive';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  DisableStateProvider,
  STEWARD_DISABLE_STATE_PROVIDER,
} from '../state-managers/injection-tokens';
import { VerifyButtonComponent } from './verify-button/verify-button.component';

/** A directive that toggles the enabled state of the host button with the provided mat-checkbox. */
@Directive({
  selector: `button[mat-button][stateManager][verifyWithV2], button[mat-raised-button][stateManager][verifyWithV2], button[mat-icon-button][stateManager][verifyWithV2],
  button[mat-fab][stateManager][verifyWithV2], button[mat-mini-fab][stateManager][verifyWithV2], button[mat-stroked-button][stateManager][verifyWithV2],
  button[mat-flat-button][stateManager][verifyWithV2]`,
  providers: [
    {
      provide: STEWARD_DISABLE_STATE_PROVIDER,
      useExisting: forwardRef(() => VerifyWithV2ButtonDirective),
      multi: true,
    },
  ],
})
export class VerifyWithV2ButtonDirective extends BaseDirective implements DisableStateProvider {
  public overrideDisable: boolean = undefined;
  public overrideDisable$ = new BehaviorSubject<boolean | undefined>(this.overrideDisable);

  private button: VerifyButtonComponent = undefined;
  private button$ = new Subject<VerifyButtonComponent>();
  private isVerified = false;

  /** The checkbox to use for verification. */
  @Input()
  public set verifyWithV2(value: VerifyButtonComponent) {
    this.button$.next(value);
  }

  constructor(private readonly host: MatButton, private readonly renderer: Renderer2) {
    super();

    this.button$.pipe(takeUntil(this.onDestroy$)).subscribe(button => {
      this.button = button;

      button.isVerifiedChange.pipe(takeUntil(this.onDestroy$)).subscribe(next => {
        this.isVerified = next;
        this.updateHostState();
      });

      this.isVerified = button.isVerified;
      this.updateHostState();
    });

    renderer.listen(host._elementRef.nativeElement, 'click', () => {
      this.clear();
    });
  }

  /** Programmatically clear the verification. */
  public clear(): void {
    this.button.isVerified = false;
    this.isVerified = false;
    // Toggling button from code doesn't trigger change callback. Need to manually emit.
    this.button.isVerifiedChange.emit(false);
    this.updateHostState();
  }

  private updateHostState(): void {
    this.overrideDisable = !this.isVerified;
    this.overrideDisable$.next(this.overrideDisable);
  }
}
