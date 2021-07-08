import { Directive, HostListener, Input } from '@angular/core';
import BigNumber from 'bignumber.js';

/** Downloads the CSV input to the client browser. */
@Directive({
  selector: '[downloadCsv]',
})
export class DownloadCsvDirective {
  /** CSV Rows where first array in array is the column definitions and subsequent ones defined the rows. */
  @Input() downloadCsv: string[][];
  @Input() filname: string;

  /** CLick event. */
  @HostListener('click', ['$event'])
  public onClick(_event: Event): void {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      this.downloadCsv
        .map(row => {
          return row
            .map(entry => {
              // Excel has a floating point limitation of 15 characters.
              // For BigNumber and strings that are numbers, we need to use format "=""${data}"""
              // so that characters at length 16+ are not replaced with zeros.
              if (
                BigNumber.isBigNumber(entry) ||
                (typeof entry === 'string' && !new BigNumber(entry).isNaN())
              ) {
                return `"=""${entry}"""`;
              }

              return entry;
            })
            .join(',');
        })
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const fileName = `${this.filname}_${new Date().toISOString()}.csv`;
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
}
