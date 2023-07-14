import BigNumber from 'bignumber.js';
import { clone, remove } from 'lodash';
import { ExtractedObjectNumbers } from './extracted-model';
import { collectType } from './collect-type';

/** Extracts numbers from the given object. */
export function extractNumbers(source: unknown): ExtractedObjectNumbers {
  if (!source) {
    return undefined;
  }
  const output: ExtractedObjectNumbers = { all: [] };
  output.all = collectType<BigNumber>(source, v => BigNumber.isBigNumber(v));
  output.other = clone(output.all);
  output.ids = remove(output.other, v => v.key.toLowerCase().endsWith('id'));
  output.xuids = remove(output.other, v => v.key.toLowerCase().endsWith('xuid'));
  output.prices = remove(output.other, v => v.key.toLowerCase().endsWith('price'));
  output.amounts = remove(output.other, v => v.key.toLowerCase().toLowerCase().includes('amount'));
  output.counts = remove(output.other, v => v.key.toLowerCase().endsWith('count'));
  return output;
}
