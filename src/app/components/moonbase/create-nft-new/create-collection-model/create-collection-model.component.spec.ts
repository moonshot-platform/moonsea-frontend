import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCollectionModelComponent } from './create-collection-model.component';

describe('CreateCollectionModelComponent', () => {
  let component: CreateCollectionModelComponent;
  let fixture: ComponentFixture<CreateCollectionModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateCollectionModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCollectionModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
