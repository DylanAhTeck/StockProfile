import { Injectable } from '@angular/core';
import { Watchlist } from '../interfaces/Watchlist'
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WatchlistService {

  constructor() { }

  public watchlistUpdated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);


  saveCompany(ticker: string, name: string, last: number, change: number,
    changePercentage: number) {

    if (!localStorage.getItem('watchlist')) localStorage.setItem('watchlist', JSON.stringify([]))

    let watchlist: Watchlist[] = JSON.parse(localStorage.getItem('watchlist'))
    watchlist.push({ ticker, name, last, change, changePercentage })
    localStorage.setItem('watchlist', JSON.stringify(watchlist))
    this.watchlistUpdated.next(true)
  }

  deleteCompany(ticker: string) {
    let watchlist: Watchlist[] = JSON.parse(localStorage.getItem('watchlist'))
    var index = watchlist.findIndex(e => e.ticker == ticker);
    watchlist.splice(index, 1);
    localStorage.setItem('watchlist', JSON.stringify(watchlist))
    this.watchlistUpdated.next(true)
  }

  saveUpdatedWatchlist(watchlists: Watchlist[]) {
    localStorage.setItem('watchlist', JSON.stringify(watchlists))
  }

  getWatchlists(): Watchlist[] {
    return JSON.parse(localStorage.getItem('watchlist'))
  }

  onWatchlist(ticker: string): boolean {
    if (!localStorage.getItem('watchlist')) localStorage.setItem('watchlist', JSON.stringify([]))

    let watchlist: Watchlist[] = JSON.parse(localStorage.getItem('watchlist'))
    var index = watchlist.findIndex(e => e.ticker == ticker);
    return index == - 1 ? false : true
  }
}
