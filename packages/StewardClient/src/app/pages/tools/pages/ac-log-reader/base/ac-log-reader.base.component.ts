import { Component, Input, OnChanges } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { BaseComponent } from '@components/base-component/base.component';
import { arrayBufferToBase64 } from '@helpers/convert-array-buffer';
import { GameTitle } from '@models/enums';
import { AcLogReaderResponse } from '@services/api-v2/steelhead/ac-log-reader/steelhead-ac-log-reader.service';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { Observable, takeUntil } from 'rxjs';

export interface AcLogReaderServiceContract {
  gameTitle: GameTitle;
  processGameLog$(log: string): Observable<AcLogReaderResponse>;
}

interface StyledLog {
  text: string;
  class: string;
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

  public postMonitor = new ActionMonitor('Process Client Crash File');
  public decodedLog: StyledLog[];

  public formControls = {
    fileName: new UntypedFormControl(null, [Validators.required]),
  };

  public formGroup = new UntypedFormGroup(this.formControls);

  public fileName: string;
  public fileContent: string;

  private category1: string[] = ['Client Req. Term', 'Prohibited Driver', 'Prohibited Module'];
  private category2: string[] = ['Inject', 'Object Holds Handle'];
  private category3: string[] = [
    'Countermeasure',
    'Counter Measure',
    'Hard Exit',
    'AntiCheat Version',
  ];
  private category4: string[] = [
    'SysInfo',
    'Not fully signed',
    'Session UID',
    'FngPrnt',
    'OS Version',
  ];

  constructor() {
    super();
  }

  /** Initialization hook. */
  public ngOnChanges(): void {
    if (!this.service) {
      throw new Error('Service Contract could not be found for AC Log Reader component.');
    }
  }

  /** Fires when the selected file changes. */
  public onFileSelected(event): void {
    const file: File = event.target.files[0];

    if (file) {
      this.fileName = file.name;
      this.decodedLog = null;
      const fileReader = new FileReader();

      fileReader.onload = e => {
        const bytes = arrayBufferToBase64(e.target.result as ArrayBuffer);
        this.fileContent = bytes;
        this.decodeLog();
      };

      fileReader.readAsArrayBuffer(file);
    }
  }

  /** Sends log file to be decoded, then parses response to apply conditional styling. */
  public decodeLog(): void {
    this.postMonitor = this.postMonitor.repeat();

    this.service
      .processGameLog$(this.fileContent)
      .pipe(this.postMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(response => {
        const split = response.decodedLog.split('\r\n');
        const splitAndStyle: StyledLog[] = split.map(line => {
          let category = null;

          if (this.category1.some(substring => line.includes(substring))) {
            category = 'category1';
          } else if (this.category2.some(substring => line.includes(substring))) {
            category = 'category2';
          } else if (this.category3.some(substring => line.includes(substring))) {
            category = 'category3';
          } else if (this.category4.some(substring => line.includes(substring))) {
            category = 'category4';
          }

          return { text: line, class: category };
        });

        this.decodedLog = splitAndStyle;

        this.formControls.fileName.reset();
      });
  }
}
