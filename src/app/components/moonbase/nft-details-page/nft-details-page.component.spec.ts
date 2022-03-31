import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NftDetailsPageComponent } from './nft-details-page.component';

describe('NftDetailsPageComponent', () => {
  let component: NftDetailsPageComponent;
  let fixture: ComponentFixture<NftDetailsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NftDetailsPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NftDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
