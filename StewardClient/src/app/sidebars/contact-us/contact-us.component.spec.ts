import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngxs/store';
import { of } from 'rxjs';
import { UserSettingsStateModel } from '@shared/state/user-settings/user-settings.state';
import { UserModel } from '@models/user.model';
import { UserRole } from '@models/enums';
import { WindowService } from '@services/window';
import { SetFakeApi, SetStagingApi } from '@shared/state/user-settings/user-settings.actions';
import {
  EndpointKeyMemoryModel,
  EndpointKeyMemoryState,
} from '@shared/state/endpoint-key-memory/endpoint-key-memory.state';
import { createStandardTestModuleMetadata } from '@mocks/standard-test-module-metadata';
import { ContactUsComponent } from './contact-us.component';

describe('ContactUsComponent', () => {
  let component: ContactUsComponent;
  let fixture: ComponentFixture<ContactUsComponent>;

  let mockStore: Store;
  let mockWindowService: WindowService;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      createStandardTestModuleMetadata({
        declarations: [ContactUsComponent],
        ngxsModules: [EndpointKeyMemoryState],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(ContactUsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
