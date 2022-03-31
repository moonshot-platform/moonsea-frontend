import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadnftsComponent } from './uploadnfts.component';

describe('UploadnftsComponent', () => {
  let component: UploadnftsComponent;
  let fixture: ComponentFixture<UploadnftsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadnftsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadnftsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
