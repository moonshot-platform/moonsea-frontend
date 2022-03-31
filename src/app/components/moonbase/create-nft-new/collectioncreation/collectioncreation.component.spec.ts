import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectioncreationComponent } from './collectioncreation.component';

describe('CollectioncreationComponent', () => {
  let component: CollectioncreationComponent;
  let fixture: ComponentFixture<CollectioncreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectioncreationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectioncreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
