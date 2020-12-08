import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApolloGiftingComponent } from './apollo-gifting.component';

describe('ApolloGiftingComponent', () => {
  let component: ApolloGiftingComponent;
  let fixture: ComponentFixture<ApolloGiftingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApolloGiftingComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApolloGiftingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
