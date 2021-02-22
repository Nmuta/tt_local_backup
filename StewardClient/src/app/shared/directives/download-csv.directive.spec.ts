import { DownloadCsvDirective } from './download-csv.directive';

describe('DownloadCsvDirective', () => {
  it('should create an instance', () => {
    const directive = new DownloadCsvDirective();
    expect(directive).toBeTruthy();
  });

  describe('When directive is clicked', () => {
    const anchorEl = new HTMLAnchorElement();

    beforeEach(() => {
      anchorEl.setAttribute = jasmine.createSpy('setAttribute');
      anchorEl.click = jasmine.createSpy('click');
      anchorEl.remove = jasmine.createSpy('remove');
      document.createElement = jasmine.createSpy('createElement').and.returnValue(anchorEl);
      document.body.appendChild = jasmine.createSpy('appendChild');
    });

    it('should create an anchor tag to download the data and remove the tag after', () => {
      const directive = new DownloadCsvDirective();
      const event = new Event('click');
      directive.onClick(event);

      expect(anchorEl.setAttribute).toHaveBeenCalledWith('href', jasmine.any(String));
      expect(anchorEl.setAttribute).toHaveBeenCalledWith('download', jasmine.any(String));
      expect(document.body.appendChild).toHaveBeenCalled();
      expect(anchorEl.click).toHaveBeenCalled();
      expect(anchorEl.remove).toHaveBeenCalled();
    });
  });
});
