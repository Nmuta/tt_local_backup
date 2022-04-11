import { ExtractedUrls } from './extracted-model';
import { collectType } from './collect-type';
import { compact, concat, isString } from 'lodash';

/** Extracts images from the given object. */
export function extractUrls(source: unknown): ExtractedUrls {
  if (!source) {
    return undefined;
  }
  const output: ExtractedUrls = { all: [] };
  const temporary = collectType<string>(source, v => isString(v));
  output.allUrls = temporary.filter(v => v.key.toLowerCase().endsWith('url'));
  output.base64Images = temporary.filter(v => v.key.toLowerCase().endsWith('imagebase64'));
  output.imageUrls = temporary.filter(v => v.key.toLowerCase().endsWith('imageurl'));
  output.allImages = concat(output.base64Images, output.imageUrls);
  output.all = compact(
    concat(output.allUrls, output.base64Images, output.imageUrls, output.allImages),
  );
  return output;
}
