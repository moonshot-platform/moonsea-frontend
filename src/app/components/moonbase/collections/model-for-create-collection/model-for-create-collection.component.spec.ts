import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelForCreateCollectionComponent } from './model-for-create-collection.component';

describe('ModelForCreateCollectionComponent', () => {
  let component: ModelForCreateCollectionComponent;
  let fixture: ComponentFixture<ModelForCreateCollectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModelForCreateCollectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelForCreateCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
