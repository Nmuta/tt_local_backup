import { ComponentType } from '@angular/cdk/portal';
import { TemplateRef, EmbeddedViewRef, Injectable, OnDestroy } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarContainer,
  MatSnackBarRef,
  SimpleSnackBar,
  TextOnlySnackBar,
} from '@angular/material/snack-bar';
import { PublicInterface } from '@helpers/types';

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

/** A Mock base for MatSnackBars */
@Injectable()
export class MatSnackBarMock implements PublicInterface<MatSnackBar>, OnDestroy {
  protected simpleSnackBarComponent: typeof SimpleSnackBar;
  protected snackBarContainerComponent: typeof MatSnackBarContainer;
  protected handsetCssClass: string;

  /** @inheritdoc */
  public get _openedSnackBarRef(): MatSnackBarRef<any> {
    return null;
  }

  /** @inheritdoc */
  public set _openedSnackBarRef(value: MatSnackBarRef<any>) {
    /* empty */
  }

  /** @inheritdoc */
  public openFromComponent<T>(
    component: ComponentType<T>,
    config?: MatSnackBarConfig<any>,
  ): MatSnackBarRef<T> {
    return null;
  }

  /** @inheritdoc */
  public openFromTemplate(
    template: TemplateRef<any>,
    config?: MatSnackBarConfig<any>,
  ): MatSnackBarRef<EmbeddedViewRef<any>> {
    return null;
  }

  /** @inheritdoc */
  public open(
    message: string,
    action?: string,
    config?: MatSnackBarConfig<any>,
  ): MatSnackBarRef<TextOnlySnackBar> {
    return null;
  }

  /** @inheritdoc */
  public dismiss(): void {
    /* empty */
  }

  /** @inheritdoc */
  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  public ngOnDestroy(): void {
    /* empty */
  }
}
