import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApolloService, createMockApolloService, MockApolloService } from '@services/apollo';
import { Subject } from 'rxjs';

import { ApolloPlayerInventoryComponent } from './apollo-player-inventory.component';

describe('ApolloPlayerInventoryComponent', () => {
  let component: ApolloPlayerInventoryComponent;
  let fixture: ComponentFixture<ApolloPlayerInventoryComponent>;
  let service: ApolloService;
  let waitUntil$: Subject<void>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApolloPlayerInventoryComponent],
      providers: [createMockApolloService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    service = TestBed.inject(ApolloService);
    waitUntil$ = new Subject<void>();
    (service as unknown as MockApolloService).waitUntil$ = waitUntil$;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApolloPlayerInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
