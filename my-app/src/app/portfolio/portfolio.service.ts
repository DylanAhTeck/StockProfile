import { Injectable } from '@angular/core';
import { Portfolio } from '../interfaces/Portfolio'
import { Description } from '../interfaces/description'
import { LatestPrice } from '../interfaces/latest-price'
import { stockChart } from 'highcharts';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {

  constructor() { }
  public portfolioUpdated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  buyStock(quantity: number,
    price: number,
    description: Description,
    latestPrice: LatestPrice) {

    var stock: Portfolio = this.getStock(description.ticker) || this.createStock(description)
    stock.quantity += quantity;
    stock.totalCost += (quantity * latestPrice.last);
    stock.averageCostPerShare = stock.totalCost / stock.quantity;
    stock.currentPrice = latestPrice.last;
    stock.marketValue = latestPrice.last * stock.quantity;
    stock.change = stock.averageCostPerShare - latestPrice.last;
    this.saveStock(stock)

    this.portfolioUpdated.next(true);
  }

  sellStock(quantity: number,
    price: number,
    description: Description,
    latestPrice: LatestPrice) {

    var stock: Portfolio = this.getStock(description.ticker)
    stock.quantity = stock.quantity - quantity;
    stock.totalCost = stock.totalCost - (quantity * latestPrice.last);
    stock.averageCostPerShare = stock.totalCost / stock.quantity;
    stock.currentPrice = latestPrice.last;
    stock.marketValue = latestPrice.last * stock.quantity;
    stock.change = stock.averageCostPerShare - latestPrice.last;

    if (stock.quantity > 0) this.saveStock(stock)
    else this.deleteStock(stock)

    this.portfolioUpdated.next(true);
  }
  deleteStock(stock: Portfolio) {
    var portfolioItem = localStorage.getItem('portfolio')
    var portfolio: Portfolio[] = JSON.parse(portfolioItem)
    var foundIndex = portfolio.findIndex(x => x.ticker == stock.ticker);
    portfolio.splice(foundIndex, 1)
    localStorage.setItem('portfolio', JSON.stringify(portfolio))
  }

  saveStock(stock: Portfolio) {
    var portfolioItem = localStorage.getItem('portfolio')
    var portfolio: Portfolio[] = portfolioItem != null ? JSON.parse(portfolioItem) : []

    var foundIndex = portfolio.findIndex(x => x.ticker == stock.ticker);

    if (foundIndex >= 0) {
      portfolio[foundIndex] = stock;
    }
    else {
      portfolio.push(stock)
    }
    localStorage.setItem('portfolio', JSON.stringify(portfolio))
  }

  createStock(description: Description): Portfolio {
    return {
      ticker: description.ticker,
      name: description.name,
      quantity: 0,
      totalCost: 0,
      averageCostPerShare: 0,
      currentPrice: 0,
      marketValue: 0,
      change: 0
    }
  }

  getStock(ticker: string): Portfolio {
    var portfolioItem = localStorage.getItem('portfolio')
    var portfolio: Portfolio[] = portfolioItem != null ? JSON.parse(portfolioItem) : []

    return portfolio.find(portfolio => portfolio.ticker == ticker)
  }

  getPortfolios(): Portfolio[] {
    let portfolioItem = localStorage.getItem('portfolio')
    if (portfolioItem) return JSON.parse(portfolioItem)
    return [];
  }

}
