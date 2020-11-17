import { TestBed, inject } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { WindowService } from './window.service';

describe('service: WindowService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([])],
      providers: [WindowService],
    });
  });

  it('should be created', inject([WindowService], (service: WindowService) => {
    expect(service).toBeTruthy();
  }));
});
