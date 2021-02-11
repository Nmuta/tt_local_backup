import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { createMockApolloService } from '@services/apollo';

import { ApolloPlayerInventoryComponent } from './apollo-player-inventory.component';

describe('ApolloPlayerInventoryComponent', () => {
  let component: ApolloPlayerInventoryComponent;
  let fixture: ComponentFixture<ApolloPlayerInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApolloPlayerInventoryComponent],
      providers: [createMockApolloService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
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
