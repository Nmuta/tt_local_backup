import { AsyncPipe } from '@angular/common';
import { ChangeDetectorRef, Pipe, PipeTransform } from '@angular/core';
import { BasePipe } from '@components/base-component/base.pipe';
import { RenderGuardAsyncPipe } from './render-guard-async.pipe';

/** Waits until after the next render step to output the value. Produces an observable. */
@Pipe({
  name: 'renderGuard',
  pure: false,
})
export class RenderGuardSyncPipe extends BasePipe implements PipeTransform {
  private readonly asyncPipe: AsyncPipe;
  private readonly renderGuardPipe: RenderGuardAsyncPipe;

  constructor(private readonly ref: ChangeDetectorRef) {
    super();
    this.asyncPipe = new AsyncPipe(ref);
    this.renderGuardPipe = new RenderGuardAsyncPipe();

    this.onDestroy$.subscribe(() => {
      this.asyncPipe.ngOnDestroy();
      this.renderGuardPipe.ngOnDestroy();
    });
  }

  /** Composite transform. */
  public transform<T>(value: T): T {
    return this.asyncPipe.transform(this.renderGuardPipe.transform(value));
  }
}
