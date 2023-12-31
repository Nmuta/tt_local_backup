/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AfterViewInit,
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  Input,
  OnChanges,
  OnDestroy,
  Type,
  ViewContainerRef,
} from '@angular/core';
import { CustomTileComponent } from '@environments/environment';
import { HomeTileInfoForNav } from '@helpers/external-links';
import { renderDelay } from '@helpers/rxjs';
import { BetterSimpleChanges } from '@helpers/simple-changes';
import { from } from 'rxjs';

/** Provides an attachment point to render a dynamic tool-tile element. */
@Directive({
  selector: '[navAnchor]',
})
export class AnchorDirective implements OnChanges, AfterViewInit, OnDestroy {
  /** REVIEW-COMMENT: UI "navAnchor" to resolve. */
  @Input('navAnchor') public componentToResolve?: () => Promise<Type<CustomTileComponent>>;
  /** REVIEW-COMMENT: Nav item. */
  @Input() public navItem: HomeTileInfoForNav;
  /** REVIEW-COMMENT: Is nav anchor disabled. */
  @Input() public navAnchorDisabled?: boolean;

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
      .pipe(renderDelay())
      .subscribe(componentToResolve => {
        const componentFactory = this.resolver.resolveComponentFactory(componentToResolve);
        this.componentRef = viewContainerRef.createComponent<CustomTileComponent>(componentFactory);
        this.componentRef.instance.item = this.navItem;
        this.componentRef.instance.disabled = this.navAnchorDisabled;
      });
  }

  /** Angular lifecycle hook. */
  public ngOnChanges(_: BetterSimpleChanges<AnchorDirective>): void {
    if (this.componentRef) {
      this.componentRef.instance.disabled = this.navAnchorDisabled;
      this.componentRef.instance.item = this.navItem;
    }
  }

  /** Angular lifecycle hook. */
  public ngOnDestroy(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
    }
  }
}
