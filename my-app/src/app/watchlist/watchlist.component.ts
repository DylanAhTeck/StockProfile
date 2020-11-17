import { Component, OnInit } from '@angular/core';
import { Watchlist } from '../interfaces/Watchlist'
import { WatchlistService } from './watchlist.service'
import { DetailsService } from '../details-page/details.service'
@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css']
})
export class WatchlistComponent implements OnInit {

  watchlists: Watchlist[] = []
  constructor(private watchlistService: WatchlistService,
    private detailsService: DetailsService) { }
  ngOnInit(): void {
    this.watchlists = this.watchlistService.getWatchlists()
    this.watchlistService.watchlistUpdated.subscribe(e => {
      this.watchlists = this.watchlistService.getWatchlists().sort((a, b) => a.ticker.localeCompare(b.ticker));

      console.log("HERE")
      this.watchlists.forEach(watchlist => {
        this.detailsService.getLatestPrice(watchlist.ticker).subscribe(
          (value) => {
            watchlist.last = value.last
            watchlist.change = (value.last - value.prevClose)
            watchlist.changePercentage = (watchlist.change * 100) / value.prevClose;
          }
        )
      })
      this.watchlistService.saveUpdatedWatchlist(this.watchlists)
    })
  }



}
