import BigNumber from 'bignumber.js';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { createMockApolloService } from '@services/apollo/apollo.service.mock';
import { ApolloBanHistoryComponent } from './apollo-ban-history.component';
import { createMockPermissionsService } from '@services/permissions';
import { PipesModule } from '@shared/pipes/pipes.module';

describe('ApolloBanHistoryComponent', () => {
  let component: ApolloBanHistoryComponent;
  let fixture: ComponentFixture<ApolloBanHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApolloBanHistoryComponent],
      imports: [PipesModule],
      providers: [createMockApolloService(), createMockPermissionsService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApolloBanHistoryComponent);
    component = fixture.componentInstance;
    component.xuid = new BigNumber(8675309);
    fixture.detectChanges();
  });

  it('should create', waitForAsync(() => {
    expect(component).toBeTruthy();
  }));

  it('should load history', () => {
    component.ngOnChanges();
    expect(component.isLoading).toBeFalsy();
  });
});
