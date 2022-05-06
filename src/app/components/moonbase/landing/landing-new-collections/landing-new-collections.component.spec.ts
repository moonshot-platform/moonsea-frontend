import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingNewCollectionsComponent } from './landing-new-collections.component';

describe('LandingNewCollectionsComponent', () => {
  let component: LandingNewCollectionsComponent;
  let fixture: ComponentFixture<LandingNewCollectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LandingNewCollectionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingNewCollectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
