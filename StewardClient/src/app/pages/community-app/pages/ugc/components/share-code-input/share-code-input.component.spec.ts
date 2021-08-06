import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import faker from 'faker';
import { ShareCodeInputComponent } from './share-code-input.component';

describe('ShareCodeInputComponent', () => {
  let component: ShareCodeInputComponent;
  let fixture: ComponentFixture<ShareCodeInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShareCodeInputComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ShareCodeInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.changes.emit = jasmine.createSpy('changes.emit');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: emitShareCodeInput', () => {
    describe('When sharecode is an empty string', () => {
      beforeEach(() => {
        component.shareCodeInput = '';
      });

      it('should emit null from changes', () => {
        component.emitShareCodeInput();

        expect(component.changes.emit).toHaveBeenCalledWith(null);
      });
    });

    describe('When sharecode is a valid string', () => {
      const testInput = faker.random.word();
      beforeEach(() => {
        component.shareCodeInput = testInput;
      });

      it('should emit the share code from changes', () => {
        component.emitShareCodeInput();

        expect(component.changes.emit).toHaveBeenCalledWith(testInput);
      });
    });
  });

  describe('Method: clearShareCodeInput', () => {
    beforeEach(() => {
      component.emitShareCodeInput = jasmine.createSpy('emitShareCodeInput');
      component.shareCodeInput = faker.random.word();
    });

    it('should set shareCodeInput to empty string', () => {
      component.clearShareCodeInput();

      expect(component.shareCodeInput).toEqual('');
    });

    it('should call emitShareCodeInput', () => {
      component.clearShareCodeInput();

      expect(component.emitShareCodeInput).toHaveBeenCalled();
    });
  });

  describe('Method: pastedShareCode', () => {
    beforeEach(() => {
      component.emitShareCodeInput = jasmine.createSpy('emitShareCodeInput');
    });

    it('should wait 1ms before calling emitShareCodeInput', fakeAsync(() => {
      component.pastedShareCode();
      expect(component.emitShareCodeInput).not.toHaveBeenCalled();

      tick(1);
      expect(component.emitShareCodeInput).toHaveBeenCalled();
    }));
  });
});
