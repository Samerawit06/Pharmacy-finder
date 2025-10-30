// src/app/services/search.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  
  // private apiUrl = 'http://localhost:3000/api/medicines';

  constructor(private http: HttpClient) { }

  searchMedicines(medicineName: string): Observable<any[]> {
   
    return of(this.getMockMedicines(medicineName));

    
    // return this.http.get<any[]>(`${this.apiUrl}/search?name=${medicineName}`)
    //   .pipe(
    //     catchError(error => {
    //       console.error('Search error:', error);
    //       throw 'Failed to search medicines. Please try again.';
    //     })
    //   );
  }

  private getMockMedicines(medicineName: string): any[] {
    //mock
    const mockMedicines = [
      {
        medicineName: 'Paracetamol',
        price: 5.99,
        quantity: '20 tablets',
        pharmacyId: 'PH001',
        pharmacyName: 'City Pharmacy'
      },
      {
        medicineName: 'Ibuprofen',
        price: 8.50,
        quantity: '30 tablets',
        pharmacyId: 'PH002',
        pharmacyName: 'Health Plus'
      },
      {
        medicineName: 'Amoxicillin',
        price: 15.75,
        quantity: '15 capsules',
        pharmacyId: 'PH003',
        pharmacyName: 'MediCare'
      }
    ];

   
    return mockMedicines.filter(medicine =>
      medicine.medicineName.toLowerCase().includes(medicineName.toLowerCase())
    );
  }
}
