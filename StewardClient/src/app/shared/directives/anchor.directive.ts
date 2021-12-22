/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AfterViewInit,
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  Type,
  ViewContainerRef,
} from '@angular/core';
import { CustomTileComponent } from '@environments/environment';
import { from } from 'rxjs';
import { delay } from 'rxjs/operators';

/** Provides an attachment point to an arbitrary element. */
@Directive({
  selector: '[anchor]',
})
export class AnchorDirective implements OnChanges, AfterViewInit, OnDestroy {
  @Input('anchor') public componentToResolve?: () => Promise<Type<CustomTileComponent>>;
  @Input() public anchorDisabled?: boolean;

  private componentRef: ComponentRef<CustomTileComponent>;

  constructor(
    public viewContainerRef: ViewContainerRef,
    private resolver: ComponentFactoryResolver,
  ) {}

  /** Angular lifecycle hook. */
  public ngAfterViewInit(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
    }

    if (!this.componentToResolve) {
      return;
    }

    const viewContainerRef = this.viewContainerRef;
    viewContainerRef.clear();
    from(this.componentToResolve())
      .pipe(delay(1))
      .subscribe(componentToResolve => {
        const componentFactory = this.resolver.resolveComponentFactory(componentToResolve);
        this.componentRef = viewContainerRef.createComponent<CustomTileComponent>(componentFactory);
        this.componentRef.instance.disabled = this.anchorDisabled;
      });
  }

  /** Angular lifecycle hook. */
  public ngOnChanges(_: SimpleChanges): void {
    if (this.componentRef) {
      this.componentRef.instance.disabled = this.anchorDisabled;
    }
  }

  /** Angular lifecycle hook. */
  public ngOnDestroy(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
    }
  }
}
