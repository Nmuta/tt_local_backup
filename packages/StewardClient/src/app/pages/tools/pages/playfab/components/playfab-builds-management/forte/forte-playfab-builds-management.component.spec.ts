import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule } from '@ngxs/store';

import { FortePlayFabBuildsManagementComponent } from './forte-playfab-builds-management.component';

describe('FortePlayFabBuildsManagementComponent', () => {
  let component: FortePlayFabBuildsManagementComponent;
  let fixture: ComponentFixture<FortePlayFabBuildsManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        NgxsModule.forRoot([]),
      ],
      declarations: [FortePlayFabBuildsManagementComponent],
      providers: [],
    }).compileComponents();

    fixture = TestBed.createComponent(FortePlayFabBuildsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
