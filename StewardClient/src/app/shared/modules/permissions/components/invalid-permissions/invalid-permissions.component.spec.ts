import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HumanizePipe } from '@shared/pipes/humanize.pipe';
import { PipesModule } from '@shared/pipes/pipes.module';
import { InvalidPermissionsComponent } from './invalid-permissions.component';

describe('InvalidPermissionsComponent', () => {
  let component: InvalidPermissionsComponent;
  let fixture: ComponentFixture<InvalidPermissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PipesModule],
      declarations: [InvalidPermissionsComponent, HumanizePipe],
    }).compileComponents();

    fixture = TestBed.createComponent(InvalidPermissionsComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
