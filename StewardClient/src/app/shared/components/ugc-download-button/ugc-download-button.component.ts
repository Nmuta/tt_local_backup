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
  /**The UGC item to display download options for. */
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

    if (!!this.item?.liveryDownloadData) {
      this.downloadOptions.push({
        label: 'C Livery',
        clickFn: () => this.downloadCLivery(this.item),
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

  /** Downloads the UGC C Livery. */
  public downloadCLivery(item: PlayerUgcItem): void {
    this.menuTrigger.closeMenu();
    const title = `${item.id}_C_Livery`;
    const liveryData = item.liveryDownloadData;

    const binaryString = window.atob(liveryData);
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
