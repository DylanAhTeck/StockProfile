import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError, interval } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';
import { Description } from '../interfaces/description'
import { LatestPrice } from '../interfaces/latest-price'
import { DailyChart } from '../interfaces/DailyChart'
import { HistoricalChart } from '../interfaces/HistoricalChart';
import { Article } from '../interfaces/Article'

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  })
};

@Injectable({
  providedIn: 'root'
})
export class DetailsService {
  url = '/details';  // URL to web api
  //url = 'http://localhost:8080/details'
  constructor(private http: HttpClient) { }

  getDescription(ticker: String): Observable<Description> {
    const response = this.http.get<Description>(`${this.url}/description/${ticker}`, httpOptions)
    return response;
  }

  getLatestPrice(ticker: String): Observable<LatestPrice> {
    const response = this.http.get<LatestPrice>(`${this.url}/price/${ticker}`, httpOptions)
    return response;
  }

  getDailyStockData(ticker: string, startDate: string, resampleFreq: string): Observable<DailyChart[]> {
    const params = new HttpParams()
      .set('ticker', ticker)
      .set('startDate', startDate)
      .set('resampleFreq', resampleFreq);

    return this.http.get<DailyChart[]>(`${this.url}/highcharts/daily`, { ...httpOptions, params: params })
  }

  getHistoricalStockData(ticker: string, startDate: string, resampleFreq: string): Observable<HistoricalChart[]> {
    const params = new HttpParams()
      .set('ticker', ticker)
      .set('startDate', startDate)
      .set('resampleFreq', resampleFreq);

    return this.http.get<HistoricalChart[]>(`${this.url}/highcharts/historical`, {
      ...httpOptions,
      params: params
    })
  }

  getNewsData(ticker: String): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.url}/news/${ticker}`)
  }

}