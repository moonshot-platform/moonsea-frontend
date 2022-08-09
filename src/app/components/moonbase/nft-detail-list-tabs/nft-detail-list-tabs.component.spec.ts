import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NftDetailListTabsComponent } from './nft-detail-list-tabs.component';

describe('NftDetailListTabsComponent', () => {
  let component: NftDetailListTabsComponent;
  let fixture: ComponentFixture<NftDetailListTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NftDetailListTabsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NftDetailListTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
