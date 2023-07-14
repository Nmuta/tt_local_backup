import { ElementRef } from '@angular/core';

/** A mock for the ElementRef. */
export class MockElementRef implements ElementRef {
  nativeElement: unknown;
}
