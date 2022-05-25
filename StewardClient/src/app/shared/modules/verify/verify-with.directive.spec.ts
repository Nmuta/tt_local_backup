import { EventEmitter, NO_ERRORS_SCHEMA, Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatCheckbox, MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { VerifyWithButtonDirective } from './verify-with.directive';

describe('VerifyWithButtonDirective', () => {
  let button: MatButton;
  const checkBox: Partial<MatCheckbox> = { change: new EventEmitter<MatCheckboxChange>() };
  let directive: VerifyWithButtonDirective;
  let mockRenderer2: Renderer2;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatButtonModule, MatCheckboxModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: Renderer2,
          useValue: {
            listen: () => {
              return;
            },
          },
        },
        {
          provide: MatButton,
          useValue: {
            _elementRef: {
              nativeElement: {
                click: () => {
                  return;
                },
              },
            },
          },
        },
      ],
    }).compileComponents();

    mockRenderer2 = TestBed.inject(Renderer2);
    button = TestBed.inject(MatButton);
  });

  beforeEach(() => {
    directive = new VerifyWithButtonDirective(button, mockRenderer2);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  describe('When the clear method is called', () => {
    beforeEach(() => {
      directive.verifyWith = checkBox as MatCheckbox;
      checkBox.checked = true;
    });

    it('should uncheck the checkbox', () => {
      directive.clear();
      expect(checkBox.checked).toBeFalsy();
    });
  });
});
