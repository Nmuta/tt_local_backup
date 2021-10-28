import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { createMockKustoService, KustoService } from '@services/kusto';
import { EntitlementsComponent } from './entitlements.component';

describe('EntitlementsComponent', () => {
  let component: EntitlementsComponent;
  let fixture: ComponentFixture<EntitlementsComponent>;

  let mockKustoService: KustoService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule, NgxsModule.forRoot()],
        declarations: [EntitlementsComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [createMockKustoService()],
      }).compileComponents();

      fixture = TestBed.createComponent(EntitlementsComponent);
      component = fixture.debugElement.componentInstance;
      mockKustoService = TestBed.inject(KustoService);

      mockKustoService.getKustoPlayerEntitlements$ = jasmine
        .createSpy('getKustoPlayerEntitlements$')
        .and.callThrough();

      fixture.detectChanges();
    }),
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
