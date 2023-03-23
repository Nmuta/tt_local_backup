import { Directive, Input, TemplateRef, ViewContainerRef, OnChanges, OnInit } from '@angular/core';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { BigSpinnerComponent } from './big-spinner/big-spinner.component';
import { BaseDirective } from '@components/base-component/base.directive';
import { takeUntil } from 'rxjs/operators';
import { Subscription } from 'rxjs';

/** Directive that will display a loading spinner until the specified ActionMonitor is completed. */
@Directive({
  selector: '[waitForMonitor]',
})
export class WaitForMonitorDirective extends BaseDirective implements OnChanges, OnInit {
  /** ActionMonitor to wait for before displaying content. */
  @Input() waitForMonitor: ActionMonitor;

  public subscription: Subscription;

  constructor(private templateRef: TemplateRef<Element>, private viewContainer: ViewContainerRef) {
    super();
  }

  /** Dummy function to force a switch to handle every possible cases. */
  readonly neverReached = (_: never) => {
    throw new Error('Should not have reached here.');
  };

  /** Angular lifecycle hook. */
  public ngOnInit(): void {
    // The showSpinnerOrContent is also called here in case the action monitor is completed before the component is instantiated.
    this.showSpinnerOrContent();
  }

  /** Angular lifecycle hook. */
  public ngOnChanges(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    this.subscription = this.waitForMonitor.status$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(_ => {
        this.showSpinnerOrContent();
      });
  }

  private showSpinnerOrContent(): void {
    // Check null for when the monitor was not initialized
    if (this.waitForMonitor.mode == null) {
      this.viewContainer.clear();
      this.viewContainer.createEmbeddedView(this.templateRef);
      return;
    }

    switch (this.waitForMonitor.mode) {
      case 'single-fire':
        if (!this.waitForMonitor.isSuccess) {
          this.viewContainer.clear();
          this.viewContainer.createComponent(BigSpinnerComponent).instance.monitor =
            this.waitForMonitor;
        } else {
          this.viewContainer.clear();
          this.viewContainer.createEmbeddedView(this.templateRef);
        }
        break;
      case 'multi-fire':
        if (this.waitForMonitor.isActive || this.waitForMonitor.isErrored) {
          this.viewContainer.clear();
          this.viewContainer.createComponent(BigSpinnerComponent).instance.monitor =
            this.waitForMonitor;
        } else {
          this.viewContainer.clear();
          this.viewContainer.createEmbeddedView(this.templateRef);
        }
        break;
    }
  }
}
