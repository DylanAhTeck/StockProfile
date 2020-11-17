import { Component, OnInit, Input } from '@angular/core';
import { Watchlist } from '../interfaces/Watchlist'
import { WatchlistService } from '../watchlist/watchlist.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-watchlist-card',
  templateUrl: './watchlist-card.component.html',
  styleUrls: ['./watchlist-card.component.css']
})
export class WatchlistCardComponent implements OnInit {

  @Input() watchlist: Watchlist
  constructor(private watchlistService: WatchlistService,
    private router: Router) { }

  ngOnInit(): void {
  }

  openDetails(): void {
    this.router.navigate(['/details', this.watchlist.ticker])
  }

  delete() {
    this.watchlistService.deleteCompany(this.watchlist.ticker)
  }
}
