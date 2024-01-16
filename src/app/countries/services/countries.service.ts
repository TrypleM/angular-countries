import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';

import { Country } from '../interfaces/country';

@Injectable({providedIn: 'root'})
export class CountriesService {

  private httpUrl: string = 'https://restcountries.com/v3.1';

  constructor(private http: HttpClient) { }

  searchCountryByAlphaCode(code: string): Observable<Country | null>{
    const url = `${this.httpUrl}/alpha/${code}`;
    return this.http.get<Country[]>(url)
    .pipe(
      map( countries => countries.length > 0 ? countries[0] : null),
      catchError( error => of(null))
    );
  }

  searchCapital(term: string): Observable<Country[]> {
    return this.search('capital', term);
  }

  searchCountry(term: string): Observable<Country[]> {
    return this.search('name', term);
  }

  searchRegion(term: string): Observable<Country[]> {
    return this.search('region', term);
  }

  private search(searchType: string, term: string): Observable<Country[]> {
    const url = `${this.httpUrl}/${searchType}/${term}`;
    return this.http.get<Country[]>(url)
    .pipe(
      catchError( error => of([]))
    );
  }

}
