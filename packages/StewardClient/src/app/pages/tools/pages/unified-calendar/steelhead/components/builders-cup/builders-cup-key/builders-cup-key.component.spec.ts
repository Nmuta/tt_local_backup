import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BuildersCupKeyComponent } from './builders-cup-key.component';

describe('BuildersCupKeyComponent', () => {
  let component: BuildersCupKeyComponent;
  let fixture: ComponentFixture<BuildersCupKeyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BuildersCupKeyComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuildersCupKeyComponent);
    component = fixture.componentInstance;
    component.filterCriteria = new Map<string, string[]>();
    component.filterCriteria.set('testSeries', ['testPlaylist1', 'testPlaylist2', 'testPlaylist3']);
    component.ngOnChanges();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
