import { Component, OnInit, Input } from '@angular/core';
import { Portfolio } from '../interfaces/Portfolio'
import { BuyModalComponent } from '../buy-modal/buy-modal.component'
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DetailsService } from '../details-page/details.service'
import { Description } from '../interfaces/description'
import { LatestPrice } from '../interfaces/latest-price'
import { Router } from '@angular/router';

@Component({
  selector: 'app-portfolio-card',
  templateUrl: './portfolio-card.component.html',
  styleUrls: ['./portfolio-card.component.css']
})
export class PortfolioCardComponent implements OnInit {

  @Input() portfolio: Portfolio
  @Input() ticker: string

  description: Description;
  latestPrice: LatestPrice;
  last: number
  constructor(public dialog: MatDialog,
    private detailsService: DetailsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // var ticker = this.portfolio.ticker
    this.getDescription(this.ticker)
    this.getLatestPrice(this.ticker)
  }

  openDetails(): void {
    this.router.navigate(['/details', this.ticker])
  }

  getDescription(ticker: string) {
    this.detailsService.getDescription(ticker)
      .subscribe(value => this.description = value)
  }

  getLatestPrice(ticker: string) {
    this.detailsService.getLatestPrice(ticker)
      .subscribe(value => this.latestPrice = value)
  }

  getChange(): number {
    return (this.latestPrice.last - this.portfolio.averageCostPerShare)
  }

  getMarketValue(): number {
    return (this.latestPrice.last * this.portfolio.quantity)
  }

  openDialog(isBuy: boolean = true) {
    this.dialog.open(BuyModalComponent, {
      data: {
        description: this.description,
        latestPrice: this.latestPrice,
        portfolio: this.portfolio,
        isBuy: isBuy
      }
    });
  }
}
