import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KustoFunctionComponent } from './kusto-function.component';

describe('KustoFunctionComponent', () => {
  let component: KustoFunctionComponent;
  let fixture: ComponentFixture<KustoFunctionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KustoFunctionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KustoFunctionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
