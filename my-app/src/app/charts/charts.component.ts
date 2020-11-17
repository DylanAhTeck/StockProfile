import { Component, OnInit, Input } from '@angular/core';
// import * as Highcharts from 'highcharts';
// import HC_stock from 'highcharts/modules/stock';
import * as Highcharts from 'highcharts/highstock';

//import HC_stock from 'highcharts/highstock';
// require('highcharts/modules/data')(Highcharts);
// require('highcharts/modules/drag-panes')(Highcharts);
import HC_data from 'highcharts/modules/data'
import HC_drag_panes from 'highcharts/modules/drag-panes';
import HC_exporting from 'highcharts/modules/exporting';
import HC_vbp from 'highcharts/indicators/volume-by-price';
import HC_indicators_all from 'highcharts/indicators/indicators-all';
import HC_indicators from 'highcharts/indicators/indicators'
// HC_stock(Highcharts);
import * as moment from 'moment'

HC_data(Highcharts)
HC_drag_panes(Highcharts)
HC_exporting(Highcharts);
HC_indicators(Highcharts)
HC_vbp(Highcharts);
// HC_indicators_all(Highcharts)


import { DetailsService } from '../details-page/details.service'
import { DailyChart } from '../interfaces/DailyChart'
import { HistoricalChart } from '../interfaces/HistoricalChart'
import { Observable } from 'rxjs';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit {

  @Input() marketIsOpen: boolean;
  @Input() ticker: string;
  constructor(private detailsService: DetailsService) { }

  updateFlag: boolean = false; // optional boolean
  Highcharts: typeof Highcharts = Highcharts; // required
  chartConstructor: string = 'stockChart'; // optional string, defaults to 'chart'
  oneToOneFlag: boolean = true; // optional boolean, defaults to false

  chartOptions: Highcharts.Options =
    {
      rangeSelector: {
        selected: 2,
        allButtonsEnabled: true,
        enabled: true,
        //"selected": 1,
      },

      // title: {
      //   text: `${this.ticker.toUpperCase()} Historical`
      // },

      subtitle: {
        text: 'With SMA and Volume by Price technical indicators'
      },

      yAxis: [{
        startOnTick: false,
        endOnTick: false,
        labels: {
          align: 'right',
          x: -3
        },
        title: {
          text: 'OHLC'
        },
        height: '60%',
        lineWidth: 2,
        resize: {
          enabled: true
        }
      }, {
        labels: {
          align: 'right',
          x: -3
        },
        title: {
          text: 'Volume'
        },
        top: '65%',
        height: '35%',
        offset: 0,
        lineWidth: 2
      }],

      tooltip: {
        split: true
      },

      plotOptions: {
        series: {
          dataGrouping: {
            units: [[
              'week', // unit name
              [1] // allowed multiples
            ], [
              'month',
              [1, 2, 3, 4, 6]
            ]]
          }
        }
      },

      series: [
        {
          type: 'candlestick',
          // name: this.ticker.toUpperCase(),
          // id: this.ticker,
          zIndex: 2,
          data: []
        },
        {
          type: 'column',
          name: 'Volume',
          id: 'volume',
          data: [],
          yAxis: 1
        }
      ]

    }

  getHighchartHistoricalChart(): Observable<HistoricalChart[]> {

    //Two years ago
    const startDate = moment(new Date(new Date().setFullYear(new Date().getFullYear() - 2))).format('YYYY-MM-DD')
    return this.detailsService.getHistoricalStockData(this.ticker, startDate, 'daily');
  }

  ngOnInit(): void {

    this.getHighchartHistoricalChart().subscribe(value => {


      var ohlc = []
      var volume = []

      var groupingUnits: [string, number[]][] = [[
        'week', // unit name
        [1] // allowed multiples
      ], [
        'month',
        [1, 2, 3, 4, 6]
      ]]

      value.forEach(dataPoint => {
        ohlc.push([new Date(dataPoint.date).getTime(), dataPoint.open, dataPoint.high, dataPoint.low, dataPoint.close])
        volume.push([new Date(dataPoint.date).getTime(), dataPoint.volume])
      })

      this.chartOptions.title = {
        text: `${this.ticker.toUpperCase()} Historical`
      }

      this.chartOptions.series = [
        {
          type: 'candlestick',
          name: this.ticker.toUpperCase(),
          id: this.ticker,
          zIndex: 2,
          data: ohlc
        },
        {
          type: 'column',
          name: 'Volume',
          id: 'volume',
          data: volume,
          yAxis: 1
        },
        {
          type: 'vbp',
          linkedTo: this.ticker,
          params: {
            volumeSeriesID: 'volume'
          },
          dataLabels: {
            enabled: false
          },
          zoneLines: {
            enabled: false
          }
        },
        {
          type: 'sma',
          linkedTo: this.ticker,
          zIndex: 1,
          marker: {
            enabled: false
          }
        }
      ]
      this.updateFlag = true
      // this.chartOptions.rangeSelector = {
      //   selected: 2,
      //   enabled: true,
      // }
      // this.updateFlag = true

    })



  }


}
