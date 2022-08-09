import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopCollectionListComponent } from './top-collection-list.component';

describe('TopCollectionListComponent', () => {
  let component: TopCollectionListComponent;
  let fixture: ComponentFixture<TopCollectionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopCollectionListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopCollectionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
