import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { environment } from '@environments/environment';
import { BlobStorageService } from '@services/blob-storage';
import { LoggerService, LogTopic } from '@services/logger';
import { ToolsAvailabilityModalComponent } from '@views/tools-availability-modal/tools-availability-modal.component';
import { includes } from 'lodash';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

/** Defines the tools availability interceptor. */
@Injectable()
export class ToolsAvailabilityInterceptor implements HttpInterceptor {
  constructor(
    private readonly dialog: MatDialog,
    private readonly loggerService: LoggerService,
    private readonly blobStorageService: BlobStorageService,
  ) {}

  /** Intercept logic that adds bearer token to request header. */
  public intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    const isStewardNonGetRequest =
      request.url.startsWith(environment.stewardApiUrl) && request.method !== 'GET';

    const isLocal = includes(request.url, 'localhost');

    const shouldHandle = !isLocal && isStewardNonGetRequest;

    if (!shouldHandle) {
      return next.handle(request);
    }

    return this.blobStorageService.getToolAvailability$().pipe(
      catchError(error => {
        this.loggerService.error(
          [LogTopic.ToolsAvailabilityInterceptor],
          new Error('Could not get tools availability from blob storage'),
          request,
          error,
        );
        return of(null);
      }),
      switchMap(toolsAvailability => {
        if (!toolsAvailability) {
          return next.handle(request);
        }

        const isChangingToolsAvailability = request.url.includes('/settings/tools/availability');
        if (toolsAvailability.allTools || isChangingToolsAvailability) {
          return next.handle(request);
        }

        const dialogsExist = this.dialog.openDialogs.length > 0;
        if (dialogsExist) {
          return EMPTY;
        }

        return this.dialog
          .open(ToolsAvailabilityModalComponent)
          .afterClosed()
          .pipe(switchMap(() => EMPTY));
      }),
    );
  }
}
