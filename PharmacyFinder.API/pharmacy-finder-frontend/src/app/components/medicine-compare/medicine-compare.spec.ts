import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicineCompare} from './medicine-compare';

describe('MedicineCompare', () => {
  let component: MedicineCompare;
  let fixture: ComponentFixture<MedicineCompare>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicineCompare]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicineCompare);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
