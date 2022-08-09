import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialSharePopUpComponent } from './social-share-pop-up.component';

describe('SocialSharePopUpComponent', () => {
  let component: SocialSharePopUpComponent;
  let fixture: ComponentFixture<SocialSharePopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SocialSharePopUpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialSharePopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
