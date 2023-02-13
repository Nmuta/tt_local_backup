import { ElementRef, NO_ERRORS_SCHEMA, Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { PermAttributesService } from '@services/perm-attributes/perm-attributes.service';
import { createMockPermAttributesService } from '@services/perm-attributes/perm-attributes.service.mock';
import { GeneralElementPermissionAttributeDirective } from './general-element-permission-attribute.directive';

describe('GeneralElementPermissionAttributeDirective', () => {
  let anchor: ElementRef;
  let directive: GeneralElementPermissionAttributeDirective;
  let mockPermAttributesService: PermAttributesService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [],
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
          provide: ElementRef,
          useValue: {
            nativeElement: {
              click: () => {
                return;
              },
              style: {
                display: 'block',
              },
            },
          },
        },
      ],
    }).compileComponents();

    mockPermAttributesService = TestBed.inject(PermAttributesService);
    anchor = TestBed.inject(ElementRef);
  });

  beforeEach(() => {
    directive = new GeneralElementPermissionAttributeDirective(
      anchor,
      mockPermAttributesService,
      null,
      null,
    );
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });
});
