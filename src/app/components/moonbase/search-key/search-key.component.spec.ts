import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchKeyComponent } from './search-key.component';

describe('SearchKeyComponent', () => {
  let component: SearchKeyComponent;
  let fixture: ComponentFixture<SearchKeyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchKeyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchKeyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
