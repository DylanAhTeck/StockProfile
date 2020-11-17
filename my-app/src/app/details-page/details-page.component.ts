import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { DetailsService } from './details.service'
import { Description } from '../interfaces/description'
import { Observable, interval, Subscription, Subject } from 'rxjs';
import { takeUntil, flatMap } from 'rxjs/operators';
import { LatestPrice } from '../interfaces/latest-price'
import { map } from 'rxjs/operators';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { BuyModalComponent } from '../buy-modal/buy-modal.component'
import { WatchlistService } from '../watchlist/watchlist.service'
import { AlertService } from '../alert/alert.service'
@Component({
  selector: 'app-details-page',
  templateUrl: './details-page.component.html',
  styleUrls: ['./details-page.component.css']
})
export class DetailsPageComponent implements OnInit {

  ticker: string;
  description: Description;
  latestPrice: LatestPrice;

  change: number
  changePercentage: number
  isPositive: boolean
  timestampAsString: string
  marketIsOpen: boolean
  onWatchlist: boolean = false;
  isInvalid: boolean = false;

  isLoading: boolean = true;

  options = {
    autoClose: true,
    keepAfterRouteChange: false
  };

  private ngUnsubscribe = new Subject();
  private refresh: Subscription;
  private updatePrice: Subscription;
  private updateDetails: Subscription;

  constructor(private activatedRoute: ActivatedRoute,
    private detailsService: DetailsService,
    private watchlistService: WatchlistService,
    public dialog: MatDialog,
    private alertService: AlertService) { }



  ngOnInit(): void {
    this.ticker = this.activatedRoute.snapshot.paramMap.get('ticker');
    this.getDescription(this.ticker)
    this.getLatestPrice(this.ticker)
    this.onWatchlist = this.watchlistService.onWatchlist(this.ticker)
    // if (this.marketIsOpen) {
    // this.refresh =
    //   interval(15 * 1000)
    //     .pipe(
    //       takeUntil(this.ngUnsubscribe)),
    //       flatMap(() => {
    //         this.detailsService.getDescription(this.ticker)

    //       })     
    //     .subscribe((val) => { this.updateComponent() });

    // }

    interval(15 * 1000)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(val => {

        this.getDescription(this.ticker)
        this.getLatestPrice(this.ticker)
      })

  }

  toggleSave(): void {
    if (this.onWatchlist) {
      this.watchlistService.deleteCompany(this.ticker)
      this.alertService.error(`${this.ticker.toUpperCase()} removed from Watchlist.`, this.options)
    }
    else {
      this.watchlistService.saveCompany(
        this.ticker,
        this.description.name,
        this.latestPrice.last,
        this.change,
        this.changePercentage
      )

      this.alertService.success(`${this.ticker.toUpperCase()} added to Watchlist.`, this.options)
    }

    this.onWatchlist = !this.onWatchlist;
  }

  getDescription(ticker: String) {

    this.updateDetails =
      this.detailsService.getDescription(ticker)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(value => {
          //console.log(new Date().getSeconds())


          this.description = value
          // if (!this.description) {
          //   this.description = value
          // }
          // else Object.assign(this.description, value)

          this.isLoading = false
        })

  }

  getLatestPrice(ticker: String) {
    this.updatePrice = this.detailsService.getLatestPrice(ticker)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(value => {
        if (!value) {
          this.isInvalid = true;
          this.isLoading = false
          return;
        }
        this.latestPrice = value

        this.setChange(this.latestPrice.last, this.latestPrice.prevClose)
        this.setChangePercentage(this.change, this.latestPrice.prevClose)
        this.setTimestamp(this.latestPrice.timestamp)
        this.setMarketIsOpen(this.latestPrice.timestamp)
      })
  }

  updateComponent() {

  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
  setChange(last: number, prevClose: number) {
    this.change = (last - prevClose);
    this.isPositive = this.change >= 0 ? true : false
  }

  setMarketIsOpen(date: string) {
    const seconds_diff = (new Date().getTime() - new Date(date).getTime()) / 1000;
    //Sometimes error with market close
    console.log(seconds_diff)
    this.marketIsOpen = seconds_diff < 60 ? true : false;
  }

  setChangePercentage(change: number, prevClose: number) {
    this.changePercentage = ((change * 100) / prevClose);
  }

  getDateTime(): String {
    return new Date().toLocaleString('en-GB').replace(",", "")
  }

  setTimestamp(timestamp: string) {
    const date = new Date(this.latestPrice.timestamp)
    this.timestampAsString = date.toLocaleString('en-GB').replace(",", "")
  }

  openDialog() {
    let dialogRef = this.dialog.open(BuyModalComponent, {
      data: {
        latestPrice: this.latestPrice,
        description: this.description,
        isBuy: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.alertService.success(`${this.ticker.toUpperCase()} bought successfully!.`, this.options)
    })
  }
}
