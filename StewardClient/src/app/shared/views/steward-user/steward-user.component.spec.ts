import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { faker } from '@interceptors/fake-api/utility';
import { UserRole } from '@models/enums';
import { UserModel } from '@models/user.model';
import { NgxsModule } from '@ngxs/store';
import { of } from 'rxjs';

import { StewardUserComponent } from './steward-user.component';

describe('StewardUserComponent', () => {
  let component: StewardUserComponent;
  let fixture: ComponentFixture<StewardUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        NgxsModule.forRoot([]),
      ],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [StewardUserComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StewardUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: ngOnChanges', () => {
    beforeEach(() => {
      // Need to subscribe to intermediate observable to verify component variable set correctly.
      component.ngOnInit();
    });
    describe('when objectId is valid', () => {
      beforeEach(() => {
        component.objectId = 'b3fd9b02-4c42-4074-bd98-c116fdcf3c48';
      });
      describe('when service returns valid gift histories', () => {
        const validUsers: UserModel[] = [
          {
            emailAddress: 'test.email@microsoft.com',
            role: UserRole.LiveOpsAdmin,
            name: `${faker.name.firstName()} ${faker.name.lastName()}`,
            objectId: `${faker.datatype.uuid()}`,
          },
        ];
        beforeEach(() => {
          // Any used to access private service for testing.
          // eslint-disable-next-line
          (component as any).userService.getStewardUsers = jasmine
            .createSpy('getStewardUsers')
            .and.returnValue(of(validUsers));
        });
        it('should set user email to returned user email value.', () => {
          component.ngOnChanges(null);
          expect(component.user.emailAddress).toEqual(validUsers[0].emailAddress);
        });
      });
    });
  });
});
