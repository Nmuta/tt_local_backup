/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

/** Converts each properties first letter to lowercase. */
export function lowercaseProperties(source: any): any {
  const objectWithLowercaseProps = {};
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      const newKey = key.charAt(0).toLowerCase() + key.slice(1);
      objectWithLowercaseProps[newKey] = source[key];
    }
  }
  return objectWithLowercaseProps;
}
