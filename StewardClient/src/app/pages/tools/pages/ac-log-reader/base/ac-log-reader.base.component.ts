import { Component, Input, OnChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from '@components/base-component/base.component';
import { arrayBufferToBase64 } from '@helpers/convert-array-buffer';
import { BetterSimpleChanges } from '@helpers/simple-changes';
import { GameTitle } from '@models/enums';
import { ProcessedAcLog } from '@services/api-v2/steelhead/ac-log-reader/steelhead-ac-log-reader.service';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { Observable, takeUntil } from 'rxjs';

export interface AcLogReaderServiceContract {
  gameTitle: GameTitle;
  processGameLog$(log: string): Observable<ProcessedAcLog>;
}

/** Component for displaying AC Log Reader. */
@Component({
  selector: 'ac-log-reader',
  templateUrl: './ac-log-reader.base.component.html',
  styleUrls: ['./ac-log-reader.base.component.scss'],
})
export class AcLogReaderBaseComponent extends BaseComponent implements OnChanges {
  /** The AC Log Reader service. */
  @Input() service: AcLogReaderServiceContract;

  public getMonitor = new ActionMonitor('Process Client Crash File');
  public decodedLog: string;

  public formControls = {
    fileName: new FormControl(null, [Validators.required]),
  };

  public formGroup = new FormGroup(this.formControls);

  public fileName: string;
  public fileContent: string;

  constructor() {
    super();
  }

  /** Initialization hook. */
  public ngOnChanges(_changes: BetterSimpleChanges<AcLogReaderBaseComponent>): void {
    if (!this.service) {
      throw new Error('Service Contract could not be found for AC Log Reader component.');
    }
  }

  /** Fires when the selected file changes. */
  public onFileSelected(event) {
    const file: File = event.target.files[0];

    if (file) {
      this.fileName = file.name;
      const fileReader = new FileReader();

      fileReader.onload = e => {
        const bytes = arrayBufferToBase64(e.target.result as ArrayBuffer);
        this.fileContent = bytes;
      };

      fileReader.readAsArrayBuffer(file);
    }
  }

  /** Fires when the Decode button is clicked. */
  public onDecodeClick() {
    this.getMonitor = this.getMonitor.repeat();

    this.service
      .processGameLog$(this.fileContent)
      .pipe(this.getMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(response => {
        this.decodedLog = response.decodedLog;
      });
  }
}
