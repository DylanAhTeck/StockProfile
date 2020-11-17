import { Component, OnInit } from '@angular/core';
import { PortfolioService } from './portfolio.service'
import { Portfolio } from '../interfaces/Portfolio'
import { DetailsService } from '../details-page/details.service'
@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {

  portfolios: Portfolio[]
  constructor(private portfolioService: PortfolioService,
    private detailsService: DetailsService
  ) {

  }

  ngOnInit(): void {
    this.portfolios = this.portfolioService.getPortfolios();

    this.portfolioService.portfolioUpdated.subscribe(value => {
      this.portfolios = this.portfolioService.getPortfolios().sort((a, b) => a.ticker.localeCompare(b.ticker));

      this.portfolios.forEach((portfolio) => {
        this.detailsService.getLatestPrice(portfolio.ticker).subscribe(
          (value) => {
            portfolio.currentPrice = value.last
            this.portfolioService.saveStock(portfolio)
          }
        )
      })
    })
  }
}
