import { ClickStopDirective } from './click-stop.directive';

describe('ClickStopDirective', () => {
  it('should create an instance', () => {
    const directive = new ClickStopDirective();
    expect(directive).toBeTruthy();
  });

  it('should stop clicks', () => {
    const directive = new ClickStopDirective();
    const event = new Event('click');
    event.stopPropagation = jasmine.createSpy('stopPropagation')
    directive.onClick(event);
    expect(event.stopPropagation).toHaveBeenCalled();
  });
});
