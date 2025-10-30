import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NearbyPharmaciesComponent } from './nearby-pharmacies';

describe('NearbyPharmacies', () => {
  let component: NearbyPharmaciesComponent;
  let fixture: ComponentFixture<NearbyPharmaciesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NearbyPharmaciesComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(NearbyPharmaciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
