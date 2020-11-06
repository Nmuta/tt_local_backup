import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  async,
  ComponentFixture,
  TestBed,
  getTestBed,
  fakeAsync,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { PlayerDetailsItemComponent } from './player-details-item.component';
import { createMockClipboard, Clipboard } from '@shared/helpers/clipboard';

describe('PlayerDetailsItemComponent', () => {
  let fixture: ComponentFixture<PlayerDetailsItemComponent>;
  let component: PlayerDetailsItemComponent;

  let mockClipboard: Clipboard;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [],
        declarations: [PlayerDetailsItemComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [createMockClipboard()],
      }).compileComponents();

      const injector = getTestBed();
      mockClipboard = injector.get(Clipboard);

      fixture = TestBed.createComponent(PlayerDetailsItemComponent);
      component = fixture.debugElement.componentInstance;
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: ngOnInit', () => {
    describe('If the input variable value is undefined', () => {
      it('should set component.showItem to false', () => {
        component.value = undefined;
        component.ngOnInit();

        expect(component.showItem).toBeFalsy();
      });
    });

    describe('If the input variable value is null', () => {
      it('should set component.showItem to true', () => {
        component.value = null;
        component.ngOnInit();

        expect(component.showItem).toBeTruthy();
      });
    });

    describe('If the input variable value is valid string', () => {
      it('should set component.showItem to true', () => {
        component.value = 'test data';
        component.ngOnInit();

        expect(component.showItem).toBeTruthy();
      });
    });
  });

  describe('Method: copyToClipboard', () => {
    beforeEach(() => {
      mockClipboard.copyMessage = jasmine.createSpy('copyMessage');
    });

    it('should set component.copied to true', () => {
      var testData = 'test-data';
      component.copyToClipboard(testData);

      expect(component.copied).toBeTruthy();
    });

    it('should call clipboard.copyMessage with input value', () => {
      var testData = 'test-data';
      component.copyToClipboard(testData);

      expect(mockClipboard.copyMessage).toHaveBeenCalledWith(testData);
    });

    describe('After waiting for 2 seconds', () => {
      it('should set component.copied to false', fakeAsync(() => {
        var testData = 'test-data';
        component.copyToClipboard(testData);

        tick(2000);
        expect(component.copied).toBeFalsy();
      }));
    });
  });
});
