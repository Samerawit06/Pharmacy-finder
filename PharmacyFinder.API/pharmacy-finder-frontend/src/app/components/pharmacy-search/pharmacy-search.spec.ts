import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacySearch } from './pharmacy-search';

describe('PharmacySearch', () => {
  let component: PharmacySearch;
  let fixture: ComponentFixture<PharmacySearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PharmacySearch]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PharmacySearch);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
