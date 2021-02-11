import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApolloPlayerInventoryComponent } from './apollo-player-inventory.component';

describe('ApolloPlayerInventoryComponent', () => {
  let component: ApolloPlayerInventoryComponent;
  let fixture: ComponentFixture<ApolloPlayerInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApolloPlayerInventoryComponent],
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
