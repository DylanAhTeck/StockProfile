import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchFormComponent } from './search-form/search-form.component';
import { DetailsPageComponent } from './details-page/details-page.component'
import { WatchlistComponent } from './watchlist/watchlist.component'
import { PortfolioComponent } from './portfolio/portfolio.component'

const routes: Routes = [{ path: '', component: SearchFormComponent },
{ path: 'details/:ticker', component: DetailsPageComponent },
{ path: 'watchlist', component: WatchlistComponent },
{ path: 'portfolio', component: PortfolioComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
