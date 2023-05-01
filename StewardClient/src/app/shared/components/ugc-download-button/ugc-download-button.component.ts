import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { BaseComponent } from '@components/base-component/base.component';
import { PlayerUgcItem } from '@models/player-ugc-item';
import { UgcType } from '@models/ugc-filters';

type UgcDownloadOption = {
  label: string;
  clickFn: () => void;
};

/** Shared module for verified actions. */
@Component({
  selector: 'ugc-download-button',
  templateUrl: './ugc-download-button.component.html',
  styleUrls: ['./ugc-download-button.component.scss'],
})
export class UgcDownloadButtonComponent extends BaseComponent implements OnChanges {
  @ViewChild(MatMenuTrigger) menuTrigger: MatMenuTrigger;
  /** REVIEW-COMMENT: The UGC item to display download options for. */
  @Input() public item: PlayerUgcItem;

  public downloadOptions: UgcDownloadOption[] = [];
  public noDownloadOptionsTooltip = 'No download options available for this UGC item';

  /** Lifecycle hook. */
  public ngOnChanges() {
    this.downloadOptions = [];
    if (!this.item) return;

    if (!!this.item?.thumbnailOneImageBase64) {
      let thumbnailOneLabel = 'Thumbnail One';
      if (this.item?.type === UgcType.Photo) {
        thumbnailOneLabel = 'Photo Thumbnail';
      }

      this.downloadOptions.push({
        label: thumbnailOneLabel,
        clickFn: () => this.downloadThumbnail(this.item, true),
      });
    }

    if (!!this.item?.thumbnailTwoImageBase64) {
      this.downloadOptions.push({
        label: 'Thumbnail Two',
        clickFn: () => this.downloadThumbnail(this.item, false),
      });
    }

    if (!!this.item?.liveryDownloadDataBase64) {
      this.downloadOptions.push({
        label: 'C Livery',
        clickFn: () =>
          this.downloadData(this.item.liveryDownloadDataBase64, `${this.item.id}_C_Livery`),
      });
    }

    if (!!this.item?.tuneBlobDownloadDataBase64) {
      this.downloadOptions.push({
        label: 'Tune blob data',
        clickFn: () =>
          this.downloadData(this.item.tuneBlobDownloadDataBase64, `${this.item.id}_TuneBlob_Data`),
      });
    }
  }

  /** Downloads the UGC Photo. */
  public downloadThumbnail(item: PlayerUgcItem, useThumbnailOne: boolean): void {
    this.menuTrigger.closeMenu();
    const title = `${item.type}_${item.id}.jpg`;
    const linkSource = useThumbnailOne
      ? item.thumbnailOneImageBase64
      : item.thumbnailTwoImageBase64;
    const downloadLink = document.createElement('a');
    downloadLink.href = linkSource;
    downloadLink.download = title;
    downloadLink.click();
    downloadLink.remove();
  }

  private downloadData(base64Data: string, title: string) {
    this.menuTrigger.closeMenu();

    const binaryString = window.atob(base64Data);
    const binaryLen = binaryString.length;
    const bytes = new Uint8Array(binaryLen);
    for (let i = 0; i < binaryLen; i++) {
      const ascii = binaryString.charCodeAt(i);
      bytes[i] = ascii;
    }

    const blob = new Blob([bytes], { type: 'application/octet-stream' });
    const downloadLink = document.createElement('a');
    downloadLink.href = window.URL.createObjectURL(blob);
    downloadLink.download = title;
    downloadLink.click();
    downloadLink.remove();
  }
}
