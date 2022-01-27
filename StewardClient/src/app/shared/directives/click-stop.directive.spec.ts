import { Component, ElementRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockElementRef } from '@mocks/element-ref.mock';
import { ClickStopDirective } from './click-stop.directive';

@Component({
  template: `<span id="container-element" clickStop>Foo Bar</span>`,
})
class ContainerComponent {}

describe('ClickStopDirective', () => {
  let fixture: ComponentFixture<ContainerComponent>;
  let elementRef: ElementRef;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContainerComponent, ClickStopDirective],
      providers: [{ provide: ElementRef, useValue: MockElementRef }],
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    fixture = TestBed.createComponent(ContainerComponent);
    elementRef = TestBed.inject(ElementRef);

    elementRef.nativeElement = fixture.nativeElement;
  });

  it('should create an instance', () => {
    const directive = new ClickStopDirective(elementRef);
    expect(directive).toBeTruthy();
  });

  it('should stop clicks', () => {
    const directive = new ClickStopDirective(elementRef);
    const event = new Event('click');
    event.stopPropagation = jasmine.createSpy('stopPropagation');
    directive.onClick(event);
    expect(event.stopPropagation).toHaveBeenCalled();
  });
});
