import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestModuleMetadata } from '@angular/core/testing';
import { StateClass } from '@ngxs/store/internals';
import { Routes } from '@angular/router';

/* eslint-disable @typescript-eslint/no-explicit-any */

export interface StandardTestModuleMetadataConfiguration extends TestModuleMetadata {
  ngxsModules?: StateClass<any>[];
  routes?: Routes;
}

/**
 * Configures a standardized, minimal testing module for use with TestBed.configureTestingModule
 * 
 * @deprecated Intended to reduce errors while transitiong to createStandardTestModuleMetadata
 */
export function createStandardTestModuleMetadataMinimal(
  original: TestModuleMetadata,
): TestModuleMetadata {
  if (!original.schemas?.length) {
    original.schemas = [NO_ERRORS_SCHEMA]
  }

  return original;
}
