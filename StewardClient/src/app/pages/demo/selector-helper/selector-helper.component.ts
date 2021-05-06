import { Component } from '@angular/core';
import { flatten, isArray, isString } from 'lodash';

/** Composites selectors together in a way angular understands. */
export function compositeSelector(selectors: string[]): string {
  return selectors.join(',\n');
}

/** Generates a number of extended selectors based on a base-selector in a way angular under stands. */
export function generateAttributeSelectors(
  baseInput: string | string[],
  attributes: string[],
  options: { includeBase: boolean } = { includeBase: false },
): string[] {
  if (isString(baseInput)) {
    baseInput = [baseInput];
  }

  const arrayBase = baseInput as string[];
  if (!isArray(arrayBase)) {
    throw new Error('Base selector was not an array.');
  }

  const allSelectorsNested = arrayBase.map(base =>
    attributes.map(attribute => `${base}[${attribute}]`),
  );
  const allSelectors = flatten(allSelectorsNested);
  if (options?.includeBase) {
    allSelectors.unshift(...arrayBase);
  }

  return allSelectors;
}

/** Helps generate custom selectors. */
@Component({
  templateUrl: './selector-helper.component.html',
  styleUrls: ['./selector-helper.component.scss'],
})
export class SelectorHelperComponent {
  public matButtonSelectors = generateAttributeSelectors('button', [
    'mat-button',
    'mat-raised-button',
    'mat-icon-button',
    'mat-fab',
    'mat-mini-fab',
    'mat-stroked-button',
    'mat-flat-button',
  ]);

  public monitorSelectors = generateAttributeSelectors(this.matButtonSelectors, ['monitor']);
  public customSelectors = {
    buttonMonitor: compositeSelector(
      generateAttributeSelectors(
        this.monitorSelectors,
        [
          'monitorWarn',
          'monitorWarnSnackbar',
          'monitorCompleteSnackbar',
          'monitorDisable',
          'waitOnMonitors',
        ],
        { includeBase: true },
      ),
    ),
    checkboxMonitor: compositeSelector(
      generateAttributeSelectors(
        generateAttributeSelectors('mat-checkbox', ['monitor']),
        ['waitOnMonitors'],
        { includeBase: true },
      ),
    ),
  };
}
