import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { fakeBigNumber, faker } from '@interceptors/fake-api/utility';
import { IdentityResultBeta } from '@models/identity-query.model';
import { createMockGravityService } from '@services/gravity/gravity.service.mock';
import { GravityGiftHistoryResultsCompactComponent } from './gravity-gift-history-results-compact.component';

describe('GravityGiftHistoryResultsCompactComponent', () => {
  let component: GravityGiftHistoryResultsCompactComponent;
  let fixture: ComponentFixture<GravityGiftHistoryResultsCompactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GravityGiftHistoryResultsCompactComponent],
      providers: [createMockGravityService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GravityGiftHistoryResultsCompactComponent);
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
