import { Component } from '@angular/core';
import { ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { HoverToCopyDirective } from './hover-to-copy.directive';

@Component({
  selector: 'copy-content',
  template: `<span id="copyContent" hoverToCopy="Copied Content">Content to Copy</span>`,
})
class ContainerComponent {}

const mouseEvents = {
  get enter() {
    const mouseenter = document.createEvent('MouseEvent');
    mouseenter.initEvent('mouseenter', true, true);
    return mouseenter;
  },
  get leave() {
    const mouseleave = document.createEvent('MouseEvent');
    mouseleave.initEvent('mouseleave', true, true);
    return mouseleave;
  },
  get click() {
    const mouseleave = document.createEvent('MouseEvent');
    mouseleave.initEvent('click', true, true);
    return mouseleave;
  },
};

describe('HoverToCopyDirective', () => {
  let fixture: ComponentFixture<ContainerComponent>;
  let element: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContainerComponent, HoverToCopyDirective],
      providers: [{ provide: ComponentFixtureAutoDetect, useValue: true }],
    });

    fixture = TestBed.createComponent(ContainerComponent);
    element = fixture.nativeElement;
  });

  it('should set container opacity to 0.1 when mouse enters and back to 1 when mouse leaves', () => {
    const targetElement = <HTMLSpanElement>element.querySelector('#copyContent');

    targetElement.dispatchEvent(mouseEvents.enter);
    expect(targetElement.style.opacity).toEqual('0.1');

    targetElement.dispatchEvent(mouseEvents.leave);
    expect(targetElement.style.opacity).toEqual('1');
  });

  it('should create a tooltip', () => {
    const targetElement = <HTMLSpanElement>element.querySelector('#copyContent');

    targetElement.dispatchEvent(mouseEvents.enter);
    const tooltipElement = <HTMLSpanElement>document.querySelector('span[class^="ng-tooltip"]');

    expect(tooltipElement).not.toBeNull();
    expect(tooltipElement.textContent).toEqual('Click to Copy');

    targetElement.dispatchEvent(mouseEvents.leave);
  });

  it('should copy to clipboard on click', () => {
    const targetElement = <HTMLSpanElement>element.querySelector('#copyContent');

    targetElement.dispatchEvent(mouseEvents.enter);
    const tooltipElement = <HTMLSpanElement>document.querySelector('span[class^="ng-tooltip"]');
    expect(tooltipElement).toBeDefined();

    targetElement.dispatchEvent(mouseEvents.click);
    expect(tooltipElement.textContent).toEqual('Copied');

    targetElement.dispatchEvent(mouseEvents.leave);
  });
});
