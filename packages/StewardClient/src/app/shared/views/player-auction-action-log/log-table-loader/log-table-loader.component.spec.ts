import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SunrisePlayersIdentitiesFakeApi } from '@interceptors/fake-api/apis/title/sunrise/players/identities';
import { fakeBigNumber } from '@interceptors/fake-api/utility';
import { createMockSunriseService } from '@services/sunrise';

import { LogTableLoaderComponent } from './log-table-loader.component';

describe('LogTableLoaderComponent', () => {
  let component: LogTableLoaderComponent;
  let fixture: ComponentFixture<LogTableLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LogTableLoaderComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogTableLoaderComponent);
    component = fixture.componentInstance;
    component.service = createMockSunriseService().useValue;
    component.identity = SunrisePlayersIdentitiesFakeApi.make([{ xuid: fakeBigNumber() }])[0];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
