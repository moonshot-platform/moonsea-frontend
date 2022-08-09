import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectiondetailsComponent } from './collectiondetails.component';

describe('CollectiondetailsComponent', () => {
  let component: CollectiondetailsComponent;
  let fixture: ComponentFixture<CollectiondetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectiondetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectiondetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
