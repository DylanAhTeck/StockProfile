import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { Description } from '../interfaces/description'
import { Observable } from 'rxjs';
import { LatestPrice } from '../interfaces/latest-price'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { PortfolioService } from '../portfolio/portfolio.service'
import { Portfolio } from '../interfaces/Portfolio'
@Component({
  selector: 'app-buy-modal',
  templateUrl: './buy-modal.component.html',
  styleUrls: ['./buy-modal.component.css']

})
export class BuyModalComponent implements OnInit {

  latestPrice: LatestPrice;
  description: Description;
  buyDisabled: boolean = true;
  portfolio: Portfolio
  isBuy: boolean
  myControl = new FormControl()

  constructor(@Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<BuyModalComponent>,
    private portfolioService: PortfolioService
  ) {
    this.latestPrice = data.latestPrice
    this.description = data.description
    this.isBuy = data.isBuy
    this.portfolio = data.portfolio;
  }

  closeModal(): void {
    //Call portfolio service and manage it he
    if (this.isBuy) this.portfolioService.buyStock(this.myControl.value, this.latestPrice.last, this.description, this.latestPrice)
    else this.portfolioService.sellStock(this.myControl.value, this.latestPrice.last, this.description, this.latestPrice)
    this.dialogRef.close({
      isBuy: this.isBuy,
      value: this.myControl.value
    });
  }

  quantityIsValid(value: number): boolean {
    if (this.isBuy) return value > 0

    return value > 0 && value <= this.portfolio.quantity
  }

  closeDialog() {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.myControl.valueChanges.subscribe(
      value => { this.buyDisabled = this.quantityIsValid(value) ? false : true }
    )
  }

}