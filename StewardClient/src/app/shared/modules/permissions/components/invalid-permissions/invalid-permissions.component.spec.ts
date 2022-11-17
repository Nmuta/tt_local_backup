import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InvalidPermissionsComponent } from './invalid-permissions.component';


describe('InvalidPermissionsComponent', () => {
  let component: InvalidPermissionsComponent;
  let fixture: ComponentFixture<InvalidPermissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InvalidPermissionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InvalidPermissionsComponent);
    component = fixture.componentInstance;
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
