import { EventEmitter, NO_ERRORS_SCHEMA, Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { VerifyWithV2ButtonDirective } from './verify-with-v2.directive';
import { VerifyButtonComponent } from './verify-button/verify-button.component';

describe('VerifyWithV2ButtonDirective', () => {
  let button: MatButton;
  const verifyButton: Partial<VerifyButtonComponent> = { isVerifiedChange: new EventEmitter<boolean>() };
  let directive: VerifyWithV2ButtonDirective;
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
    directive = new VerifyWithV2ButtonDirective(button, mockRenderer2);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  describe('When the clear method is called', () => {
    beforeEach(() => {
      directive.verifyWithV2 = verifyButton as VerifyButtonComponent;
      verifyButton.isVerified = true;
    });

    it('should uncheck the checkbox', () => {
      directive.clear();
      expect(verifyButton.isVerified).toBeFalsy();
    });
  });
});
