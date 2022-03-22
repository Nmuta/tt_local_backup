import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { fakeBigNumber, faker } from '@interceptors/fake-api/utility';
import { IdentityResultBeta } from '@models/identity-query.model';
import { createMockGravityService } from '@services/gravity/gravity.service.mock';
import { GravityGiftHistoryResultsComponent } from './gravity-gift-history-results.component';

describe('GravityGiftHistoryResultsComponent', () => {
  let component: GravityGiftHistoryResultsComponent;
  let fixture: ComponentFixture<GravityGiftHistoryResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GravityGiftHistoryResultsComponent],
      providers: [createMockGravityService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GravityGiftHistoryResultsComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    component.selectedPlayer = {
      query: null,
      gamertag: faker.random.word(),
      xuid: fakeBigNumber(),
      t10Id: faker.datatype.uuid(),
      error: null,
    } as IdentityResultBeta;
  });

  it(
    'should create',
    waitForAsync(() => {
      expect(component).toBeTruthy();
    }),
  );
});
