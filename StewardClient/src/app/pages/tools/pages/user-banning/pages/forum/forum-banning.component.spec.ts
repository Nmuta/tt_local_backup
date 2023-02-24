import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForumBanningComponent } from './forum-banning.component';
import { createMockForumBanService } from '@services/api-v2/all/players/forum-ban.service.mock';
import { ForumBanService } from '@services/api-v2/all/players/forum-ban.service';
import { AugmentedCompositeIdentity } from '@views/player-selection/player-selection-base.component';
import { fakeBigNumber } from '@interceptors/fake-api/utility';
import { IdentityResultAlpha } from '@models/identity-query.model';

describe('ForumBanningComponent', () => {
  let component: ForumBanningComponent;
  let fixture: ComponentFixture<ForumBanningComponent>;
  let forumBanService: ForumBanService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ForumBanningComponent],
      providers: [createMockForumBanService(), createMockForumBanService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    forumBanService = TestBed.inject(ForumBanService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForumBanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should submit', () => {
    component.submitBan();

    expect(forumBanService.postBanPlayers$).toHaveBeenCalled();
  });
  describe('When subscribing to the banning observable', () => {
    const generalIdentity: IdentityResultAlpha = {
      query: { xuid: fakeBigNumber() },
      error: null,
    };
    const fakeIdentity: AugmentedCompositeIdentity = {
      apollo: null,
      forte: null,
      opus: null,
      query: null,
      woodstock: null,
      steelhead: null,
      sunrise: null,
      result: null,
      general: generalIdentity,
    };

    it('should set playerIdentities', () => {
      component.onPlayerIdentitiesChange([fakeIdentity]);

      expect(component.playerIdentities).toEqual([generalIdentity]);
    });
  });
});
