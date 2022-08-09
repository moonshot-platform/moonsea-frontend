import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LangdingUpcomingCollectionsComponent } from './langding-upcoming-collections.component';

describe('LangdingUpcomingCollectionsComponent', () => {
  let component: LangdingUpcomingCollectionsComponent;
  let fixture: ComponentFixture<LangdingUpcomingCollectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LangdingUpcomingCollectionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LangdingUpcomingCollectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
