import { DownloadCsvDirective } from './download-csv.directive';

describe('DownloadCsvDirective', () => {
  it('should create an instance', () => {
    const directive = new DownloadCsvDirective();
    expect(directive).toBeTruthy();
  });

  describe('When directive is clicked', () => {
    let anchorEl: HTMLAnchorElement;

    beforeEach(() => {
      anchorEl = document.createElement('a') as HTMLAnchorElement;
      anchorEl.setAttribute = jasmine.createSpy('setAttribute');
      anchorEl.click = jasmine.createSpy('click').and.callFake(() => { /** Empty */});
      anchorEl.remove = jasmine.createSpy('remove');
      spyOn(document, 'createElement').and.returnValue(anchorEl);
      spyOn(document.body, 'appendChild').and.callThrough();
    });

    it('should create an anchor tag to download the data and remove the tag after', () => {
      const directive = new DownloadCsvDirective();
      directive.downloadCsv = [ ['col1', 'col2'], [ 'row1val1', 'row1val2' ]];
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