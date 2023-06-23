import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';
import { HumanizePipe } from '@shared/pipes/humanize.pipe';
import { PipesModule } from '@shared/pipes/pipes.module';
import { InvalidPermissionsComponent } from './invalid-permissions.component';
import { GameTitle } from '@models/enums';

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

  describe('Method: setPermAttributeName', () => {
    const feature = PermAttributeName.GiftPlayer;
    const title = GameTitle.FM8;
    const environment = 'Studio';

    it('should set the correct mat tooltip string', () => {
      component.setPermAttributeName(feature, title, environment);

      expect(component.matTooltip).toEqual(
        `You do not have the permissions to use this feature: Gift Player - FM8 - Studio`,
      );
    });
  });
});
