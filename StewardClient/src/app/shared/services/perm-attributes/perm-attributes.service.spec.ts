import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { getTestBed, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule } from '@ngxs/store';
import { ChangelogState } from '@shared/state/changelog/changelog.state';

import { PermAttributesService } from './perm-attributes.service';

describe('PermAttributesService', () => {
  let service: PermAttributesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        NgxsModule.forRoot([ChangelogState]),
      ],
      providers: [],
      schemas: [NO_ERRORS_SCHEMA],
    });

    const injector = getTestBed();
    service = injector.inject(PermAttributesService);
  });

  it('should be created', waitForAsync(() => {
    expect(service).toBeTruthy();
  }));
});
