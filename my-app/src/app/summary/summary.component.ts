import { Component, OnInit, Input } from '@angular/core';
import { Description } from '../interfaces/description';
import { LatestPrice } from '../interfaces/latest-price';

import * as Highcharts from 'highcharts';
import HC_stock from 'highcharts/modules/stock';
HC_stock(Highcharts);
import { DetailsService } from '../details-page/details.service'
import { DailyChart } from '../interfaces/DailyChart'
import { Observable } from 'rxjs';
import * as moment from 'moment'
@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {

  @Input() description: Description;
  @Input() latestPrice: LatestPrice;
  @Input() marketIsOpen: boolean;
  @Input() ticker: string;

  data: []
  Highcharts: typeof Highcharts = Highcharts; // required
  chartConstructor: string = 'stockChart'; // optional string, defaults to 'chart'
  chartOptions: Highcharts.Options = {
    series: [{
      type: 'line'
    }]
  };
  updateFlag: boolean = false;

  constructor(private detailsService: DetailsService) { }

  ngOnInit(): void {

    this.getHighchartDailyChart().subscribe(value => {
      const data = []
      value.forEach(dataPoint => {
        data.push([new Date(dataPoint.date).getTime(), (dataPoint.low + dataPoint.high) / 2])
      })
      this.chartOptions = {
        subtitle: {
          text: this.ticker.toUpperCase()
        },
        xAxis: {
          type: "datetime",
        },
        series: [{
          name: this.ticker.toUpperCase(),
          tooltip: {
            valueDecimals: 2
          },
          data: data,
          type: 'line',
          color: this.marketIsOpen ? 'green' : 'red'
        }],
        rangeSelector: {
          inputEnabled: false,
          buttonTheme: {
            visibility: 'hidden'
          },
          labelStyle: {
            visibility: 'hidden'
          }
        }
      }

      this.updateFlag = true;
    })

  }


  getHighchartDailyChart(): Observable<DailyChart[]> {
    const ticker = this.ticker;
    const resampleFreq = '20min';
    const date = this.marketIsOpen ? new Date() : new Date(this.latestPrice.timestamp)
    const startDate = moment.utc(new Date(date)).format('YYYY-MM-DD')
    return this.detailsService.getDailyStockData(ticker, startDate, resampleFreq);
  }


}
