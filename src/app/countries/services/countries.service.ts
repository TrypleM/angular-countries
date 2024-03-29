import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';

import { Country } from '../interfaces/country.interface';
import { CacheStore } from '../interfaces/cache-store.interface';
import { Region } from '../interfaces/region.type';

@Injectable({providedIn: 'root'})
export class CountriesService {

  private apiUrl: string = 'https://restcountries.com/v3.1';

  public cacheStore: CacheStore = {
    byCapital: { term: '', countries: [] },
    byCountry: { term: '', countries: [] },
    byRegion: { region: '', countries: [] },
  }

  constructor(private http: HttpClient) {
    this.loadFromLocalStorage();
  }

  private saveToLocalStorage(): void {
    localStorage.setItem('cacheStore', JSON.stringify(this.cacheStore));
  }

  private loadFromLocalStorage(): void {
    if (!localStorage.getItem('cacheStore')) return;
    this.cacheStore = JSON.parse(localStorage.getItem('cacheStore')!);
  }

  private getCountriesRequest(searchType: string, term: string): Observable<Country[]> {
    const url = `${this.apiUrl}/${searchType}/${term}`;
    return this.http.get<Country[]>(url)
    .pipe(
      catchError( () => of([])),
      tap( countries => {
        switch (searchType) {
          case 'capital':
            this.cacheStore.byCapital = { term, countries };
            break;
          case 'name':
            this.cacheStore.byCountry = { term, countries };
            break;
          case 'region':
            this.cacheStore.byRegion = { region: term as Region, countries}
            break;
        }
      }),
      tap(() => this.saveToLocalStorage())
      // delay(2000)
    );
  }

  searchCountryByAlphaCode(code: string): Observable<Country | null>{
    const url = `${this.apiUrl}/alpha/${code}`;
    return this.http.get<Country[]>(url)
    .pipe(
      map( countries => countries.length > 0 ? countries[0] : null),
      catchError( () => of(null))
    );
  }

  searchCapital(term: string): Observable<Country[]> {
    return this.getCountriesRequest('capital', term);
  }

  searchCountry(term: string): Observable<Country[]> {
    return this.getCountriesRequest('name', term);
  }

  searchRegion(term: string): Observable<Country[]> {
    return this.getCountriesRequest('region', term);
  }



}
