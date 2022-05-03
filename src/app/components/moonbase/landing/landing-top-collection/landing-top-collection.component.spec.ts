import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingTopCollectionComponent } from './landing-top-collection.component';

describe('LandingTopCollectionComponent', () => {
  let component: LandingTopCollectionComponent;
  let fixture: ComponentFixture<LandingTopCollectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LandingTopCollectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingTopCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
