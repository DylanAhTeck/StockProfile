import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';
import { Autocomplete } from './autocomplete'

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  })
};

@Injectable({
  providedIn: 'root'
})
export class AutocompleteService {
  //url = 'http://localhost:8080/autocomplete';  // URL to web api
  url = '/autocomplete'
  constructor(private http: HttpClient) {
  }

  getSuggestions(ticker: String): Observable<Autocomplete[]> {
    const response = this.http.get<Autocomplete[]>(`${this.url}/${ticker}`, httpOptions)
    return response;
  }
}


