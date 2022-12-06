import { NO_ERRORS_SCHEMA, Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PermAttributesService } from '@services/perm-attributes/perm-attributes.service';
import { createMockPermAttributesService } from '@services/perm-attributes/perm-attributes.service.mock';
import { CheckboxPermissionAttributeDirective } from './checkbox-permission-attribute.directive';

describe('CheckboxPermissionAttributeDirective', () => {
  let button: MatButton;
  let directive: CheckboxPermissionAttributeDirective;
  let mockPermAttributesService: PermAttributesService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatButtonModule, MatCheckboxModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        createMockPermAttributesService(),
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

    mockPermAttributesService = TestBed.inject(PermAttributesService);
    button = TestBed.inject(MatButton);
  });

  beforeEach(() => {
    directive = new CheckboxPermissionAttributeDirective(
      button._elementRef.nativeElement,
      mockPermAttributesService,
      null,
      null,
    );
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });
});
