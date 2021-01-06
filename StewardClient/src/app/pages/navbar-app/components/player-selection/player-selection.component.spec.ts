import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { PlayerSelectionBaseComponent } from './player-selection.base.component';
import { of } from 'rxjs';

describe('PlayerSelectionBaseComponent', () => {
  let fixture: ComponentFixture<PlayerSelectionBaseComponent<any>>;
  let component: PlayerSelectionBaseComponent<any>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule.withRoutes([]),
          HttpClientTestingModule,
          NgxsModule.forRoot(),
        ],
        declarations: [PlayerSelectionBaseComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [],
      }).compileComponents();

      fixture = TestBed.createComponent(PlayerSelectionBaseComponent as any);
      component = fixture.debugElement.componentInstance;
    }),
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Player Selection Component:', () => {
      
    describe('Method: playerInfoChanged', () => {
      beforeEach(() => {
        component.checkValidateButtonState = jasmine.createSpy('checkValidateButtonState');
      });
      it('should call checkValidateButtonState', () => {
        component.playerInfoChanged();
        expect(component.checkValidateButtonState).toHaveBeenCalled();
      });
      describe('When textarea data has no newlines in it', () => {
        it('should set playerIds array with only one element', () => {
          const expectedData = 'foo';
          component.data = expectedData;
          component.playerInfoChanged();
          expect(component.playerIds.length).toEqual(1);
          expect(component.playerIds[0]).toEqual(expectedData);
        });
      });
      describe('When textarea data has newlines in it', () => {
        it('should set playerIds array with only one element', () => {
          const expectedData1 = 'foo';
          const expectedData2 = 'bar';
          component.data = `${expectedData1}\n${expectedData2}`;
          component.playerInfoChanged();
          expect(component.playerIds.length).toEqual(2);
          expect(component.playerIds[0]).toEqual(expectedData1);
          expect(component.playerIds[1]).toEqual(expectedData2);
        });
      });
      describe('When there is more than one playerIds', () => {
        beforeEach(() => {
          component.data = `foo\nbar`;
        });

        describe('And allowGroup is set to true', () => {
          beforeEach(() => {
            component.allowGroup = true;
          });
          it('should set showExpandedTextArea to true', () => {
            component.playerInfoChanged();
            expect(component.showExpandedTextArea).toBeTruthy();
          });
          it('should set showGroupDisabledError to false', () => {
            component.playerInfoChanged();
            expect(component.showGroupDisabledError).toBeFalsy();
          });
        });
        describe('And allowGroup is set to false', () => {
          beforeEach(() => {
            component.allowGroup = false;
          });
          it('should set showExpandedTextArea to false', () => {
            component.playerInfoChanged();
            expect(component.showExpandedTextArea).toBeFalsy();
          });
          it('should set showGroupDisabledError to true', () => {
            component.playerInfoChanged();
            expect(component.showGroupDisabledError).toBeTruthy();
          });
        });
      
      });
      describe('When there is less than or equal to one playerId', () => {
        beforeEach(() => {
          component.data = `foo`;
        });
        describe('And allowGroup is set to true', () => {
          beforeEach(() => {
            component.allowGroup = true;
          });
          it('should set showExpandedTextArea to false', () => {
            component.playerInfoChanged();
            expect(component.showExpandedTextArea).toBeFalsy();
          });
          it('should set showGroupDisabledError to false', () => {
            component.playerInfoChanged();
            expect(component.showGroupDisabledError).toBeFalsy();
          });
        });
        describe('And allowGroup is set to false', () => {
          beforeEach(() => {
            component.allowGroup = false;
          });
          it('should set showExpandedTextArea to false', () => {
            component.playerInfoChanged();
            expect(component.showExpandedTextArea).toBeFalsy();
          });
          it('should set showGroupDisabledError to false', () => {
            component.playerInfoChanged();
            expect(component.showGroupDisabledError).toBeFalsy();
          });
        });
      });
    });
    describe('Method: playerIdTypeChange', () => {
      const newIdType = 'xuid';
      beforeEach(() => {
        component.checkValidateButtonState = jasmine.createSpy('checkValidateButtonState');
        component.playerIdType = 'gamertag';
      });
      it('should set playerIdType', () => {
        expect(component.playerIdType).toEqual('gamertag')
        component.playerIdTypeChange(newIdType);
        expect(component.playerIdType).toEqual(newIdType)
      });
      it('should call checkValidateButtonState', () => {
        component.playerIdTypeChange(newIdType);
        expect(component.checkValidateButtonState).toHaveBeenCalled();
      });
    });
    describe('Method: clearInput', () => {
      beforeEach(() => {
        component.playerInfoChanged = jasmine.createSpy('playerInfoChanged');
      });
      it('should set component.data to empty string', () => {
        component.clearInput();
        expect(component.data).toEqual('');
      });
      it('should set component.showGroupDisabledError false', () => {
        component.clearInput();
        expect(component.showGroupDisabledError).toBeFalsy();
      });
      it('should call component.playerInfoChanged', () => {
        component.clearInput();
        expect(component.playerInfoChanged).toHaveBeenCalled();
      });
    });
    describe('Method: clearResults', () => {
      beforeEach(() => {
        component.clearInput = jasmine.createSpy('clearInput');
        component.emitPlayerIdentities = jasmine.createSpy('emitPlayerIdentities');
      });
      it('should component.selectedPlayerIdentity to null', () => {
        component.clearResults();
        expect(component.selectedPlayerIdentity).toEqual(null);
      });
      it('should component.playerIdentities to empty array', () => {
        component.clearResults();
        expect(component.playerIdentities.length).toEqual(0);
      });
      it('should call component.clearInput', () => {
        component.clearResults();
        expect(component.clearInput).toHaveBeenCalled();
      });
      it('should call component.emitPlayerIdentities', () => {
        component.clearResults();
        expect(component.emitPlayerIdentities).toHaveBeenCalled();
      });
    });
    describe('Method: checkValidateButtonState', () => {
      beforeEach(() => {
        component.disableValidateButton = true;
      });
      describe('If playerIds is > 1', () => {
        beforeEach(() => {
          component.playerIds = ['foo', 'bar'];
        });
        describe('If allowGroup is true', () => {
          beforeEach(() => {
            component.allowGroup = true;
          });
          it('should set disableValidateButton to false', () => {
            component.checkValidateButtonState();
            expect(component.disableValidateButton).toBeFalsy();
          });
        });
        describe('If allowGroup is false', () => {
          beforeEach(() => {
            component.allowGroup = false;
          });
          it('should set disableValidateButton to true', () => {
            component.checkValidateButtonState();
            expect(component.disableValidateButton).toBeTruthy();
          });
        });
      });
      describe('If playerIds is === 1', () => {
        beforeEach(() => {
          component.playerIds = ['foo'];
        });
        it('should set disableValidateButton to false', () => {
          component.checkValidateButtonState();
          expect(component.disableValidateButton).toBeFalsy();
        });
      });
      describe('If playerIds is < 0', () => {
        beforeEach(() => {
          component.playerIds = [];
        });
        it('should set disableValidateButton to true', () => {
          component.checkValidateButtonState();
          expect(component.disableValidateButton).toBeTruthy();
        });
      });
    });
    describe('Method: validatePlayerIds', () => {
      const identityResponses = ['foo', 'bar', 'cat', 'dog'];
      beforeEach(() => {
        component.emitPlayerIdentities = jasmine.createSpy('emitPlayerIdentities');
        component.makeRequestToValidateIds$ = jasmine.createSpy('makeRequestToValidateIds$')
          .and.returnValue(of(identityResponses));
      });
      it('should set playerIdentities', () => {
        component.validatePlayerIds();
        expect(component.playerIdentities).toEqual(identityResponses);
      });
      it('should call emitPlayerIdentities', () => {
        component.validatePlayerIds();
        expect(component.emitPlayerIdentities).toHaveBeenCalled();
      });
    });
    describe('Method: removePlayerFromList', () => {
      const indexToRemove = 1;
      beforeEach(() => {
        component.emitPlayerIdentities = jasmine.createSpy('emitPlayerIdentities');
        component.clearResults = jasmine.createSpy('clearResults');

        component.playerIdentities = ['foo', 'bar', 'cat', 'dog'];
      });
      it('should set selectedPlayerIdentity to null', () => {
        component.removePlayerFromList(indexToRemove);
        expect(component.selectedPlayerIdentity).toEqual(null);
      });
      it('should remove the correct index from playerIdentities', () => {
        component.removePlayerFromList(indexToRemove);
        expect(component.playerIdentities.length).toEqual(3);
        expect(component.playerIdentities[0]).toEqual('foo');
        expect(component.playerIdentities[1]).toEqual('cat');
        expect(component.playerIdentities[2]).toEqual('dog');
      });
      it('should call emitPlayerIdentities', () => {
        component.removePlayerFromList(indexToRemove);
        expect(component.emitPlayerIdentities).toHaveBeenCalled();
      });
      describe('If playerIdentities >= 1 after index is removed', () => {
        it('should not call clearResults', () => {
          component.removePlayerFromList(indexToRemove);
          expect(component.clearResults).not.toHaveBeenCalled();
        });
      });
      describe('If playerIdentities < 1 after index is removed', () => {
        beforeEach(() => {
          component.playerIdentities = ['foo'];
        });
        it('should call clearResults', () => {
          component.removePlayerFromList(0);
          expect(component.clearResults).toHaveBeenCalled();
        });
      });
    });
  });
});
