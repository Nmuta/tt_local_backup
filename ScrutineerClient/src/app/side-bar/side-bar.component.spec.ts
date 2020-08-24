// General
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Store, NgxsModule } from '@ngxs/store';
import { async, ComponentFixture, TestBed, inject, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

// Components
import { SidebarComponent } from './side-bar.component';

// States
import { UserState } from '@shared/state/user/user.state';
import { createMockRouter } from '@shared/mocks/router.mock';
import { createMockMsalService } from '@shared/mocks/msal.service.mock';

describe('SidebarComponent', () => {
    let mockStore: Store;

    let fixture: ComponentFixture<SidebarComponent>;
    let component: SidebarComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule.withRoutes([]),
                HttpClientTestingModule,
                NgxsModule.forRoot([UserState])
            ],
            declarations: [SidebarComponent],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                createMockRouter(),
                createMockMsalService()
            ]
        }).compileComponents();

        const injector = getTestBed();
        mockStore = injector.get(Store);

        fixture = TestBed.createComponent(SidebarComponent);
        component = fixture.debugElement.componentInstance;
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
