import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StewardManagementComponent } from './steward-management.component';

describe('StewardManagementComponent', () => {
  let component: StewardManagementComponent;
  let fixture: ComponentFixture<StewardManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StewardManagementComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StewardManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
