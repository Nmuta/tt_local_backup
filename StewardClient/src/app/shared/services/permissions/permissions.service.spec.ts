import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule } from '@ngxs/store';

import { OldPermissionsService } from './permissions.service';

describe('OldPermissionsService', () => {
  let service: OldPermissionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        NgxsModule.forRoot([]),
      ],
      providers: [],
      schemas: [NO_ERRORS_SCHEMA],
    });

    service = TestBed.inject(OldPermissionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
