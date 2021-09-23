import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import faker from 'faker';
import { PastableSingleInputComponent } from './pastable-single-input.component';

describe('PastableSingleInputComponent', () => {
  let component: PastableSingleInputComponent;
  let fixture: ComponentFixture<PastableSingleInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PastableSingleInputComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PastableSingleInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.changes.emit = jasmine.createSpy('changes.emit');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: emitInput', () => {
    describe('When sharecode is an empty string', () => {
      beforeEach(() => {
        component.input = '';
      });

      it('should emit null from changes', () => {
        component.emitInput();

        expect(component.changes.emit).toHaveBeenCalledWith(null);
      });
    });

    describe('When sharecode is a valid string', () => {
      const testInput = faker.random.word();
      beforeEach(() => {
        component.input = testInput;
      });

      it('should emit the share code from changes', () => {
        component.emitInput();

        expect(component.changes.emit).toHaveBeenCalledWith(testInput);
      });
    });
  });

  describe('Method: clearInput', () => {
    beforeEach(() => {
      component.emitInput = jasmine.createSpy('emitInput');
      component.input = faker.random.word();
    });

    it('should set input to empty string', () => {
      component.clearInput();

      expect(component.input).toEqual('');
    });

    it('should call emitInput', () => {
      component.clearInput();

      expect(component.emitInput).toHaveBeenCalled();
    });
  });

  describe('Method: pastedInput', () => {
    beforeEach(() => {
      component.emitInput = jasmine.createSpy('emitInput');
    });

    it('should wait 1ms before calling emitInput', fakeAsync(() => {
      component.pastedInput();
      expect(component.emitInput).not.toHaveBeenCalled();

      tick(1);
      expect(component.emitInput).toHaveBeenCalled();
    }));
  });
});
